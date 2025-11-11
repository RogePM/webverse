import express from 'express';
import { FoodItem, BarcodeCache } from '../models/FoodItemModel.js';
import { ChangeLog } from '../models/ChangeLogModel.js';

const router = express.Router();

router.get('/', async (request, response) => {
    try {
        const foods = await FoodItem.find();

        return response.status(200).json({
            count: foods.length,
            data: foods,
        });
    } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: 'Error fetching food items' });
    }
});

// fetch recent changes 
router.get('/changes/recent', async (request, response) => {
    try {
        const changes = await ChangeLog.find()
            .sort({ timestamp: -1 })
            .limit(50);
        return response.status(200).json(changes);
    } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: 'Error fetching changes' });
    }
});

// Barcode lookup route - must be before /:id route
router.get('/barcode/:code', async (request, response) => {
    try {
        const { code } = request.params;
        
        // Look up barcode in cache
        const cached = await BarcodeCache.findOne({ barcode: code });
        
        if (cached) {
            return response.status(200).json({
                found: true,
                data: {
                    name: cached.name,
                    category: cached.category,
                    storageLocation: cached.storageLocation,
                }
            });
        }
        
        // Not found in cache
        return response.status(200).json({
            found: false,
            data: null
        });
    } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: 'Error looking up barcode' });
    }
});
//Route for get food item by id
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const food = await FoodItem.findById(id);

        return response.status(200).json(food);
    } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: 'Error fetching food item' });
    }
});
//Route for update food item 
router.put('/:id', async (request, response) => {
    try {
        if (
            !request.body.name ||
            !request.body.category ||
            request.body.quantity === undefined ||
            !request.body.expirationDate ||
            !request.body.storageLocation
        ) {
            return response.status(400).send({
                message: 'Please provide all required fields'
            });
        }
        const { id } = request.params;

        // Fetch old item for comparison
        const oldItem = await FoodItem.findById(id);
        if (!oldItem) {
            return response.status(404).json({ message: 'Food item not found' });
        }

        // Prepare update data with timestamp
        const updateData = {
            ...request.body,
            lastModified: new Date()
        };

        const result = await FoodItem.findByIdAndUpdate(id, updateData, { new: true });

        // Compare fields and record changes
        const changes = {};
        for (const key of Object.keys(updateData)) {
            if (
                key !== 'lastModified' &&
                key !== '_id' &&
                oldItem[key]?.toString() !== updateData[key]?.toString()
            ) {
                changes[key] = {
                    old: oldItem[key],
                    new: updateData[key]
                };
            }
        }

        if (Object.keys(changes).length > 0) {
            await logChange('updated', result, changes);
        }

        return response.status(200).send({ message: 'Food item updated successfully', data: result });
    } catch (error) {
        console.error('Error updating food item:', error);
        return response.status(500).send({ message: 'Error updating food item', error: error.message });
    }
});
//Route for delete food item
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const result = await FoodItem.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: 'Food item not found' });
        }

        // Log deletion
        await logChange('deleted', result);

        return response.status(200).send({ message: 'Food item deleted successfully' });
    } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: 'Error deleting food item' });
    }
});

router.post('/', async (request, response) => {
    try {
        const data = request.body;

        // Helper function to validate a food item (donor removed - not in form)
        const isValidItem = (item) =>
            item &&
            item.name &&
            item.category &&
            item.quantity &&
            item.expirationDate &&
            item.storageLocation;

        // If data is an array, handle bulk insert
        if (Array.isArray(data)) {
            // Validate all items
            for (const item of data) {
                if (!isValidItem(item)) {
                    return response.status(400).send({ message: 'Please provide all required fields for each item' });
                }
            }
            // Add lastModified to each item
            const itemsWithDate = data.map(item => ({
                ...item,
                lastModified: new Date()
            }));
            const createdItems = await FoodItem.create(itemsWithDate);
            // Log each addition
            for (const item of createdItems) {
                await logChange('added', item);
            }
            return response.status(201).send(createdItems);
        }

        // Handle single item
        if (!isValidItem(data)) {
            console.log('Validation failed. Received data:', data);
            return response.status(400).send({ 
                message: 'Please provide all required fields',
                required: ['name', 'category', 'quantity', 'expirationDate', 'storageLocation']
            });
        }
        
        // Prepare item with timestamp
        const newFoodItem = {
            name: data.name,
            category: data.category,
            quantity: data.quantity,
            expirationDate: data.expirationDate,
            storageLocation: data.storageLocation || 'N/A',
            lastModified: new Date(),
        };
        
        // Add barcode if provided
        if (data.barcode && data.barcode.trim()) {
            newFoodItem.barcode = data.barcode.trim();
        }
        
        console.log('Creating food item:', newFoodItem);
        const foodItem = await FoodItem.create(newFoodItem);
        console.log('Food item created successfully:', foodItem._id);
        
        // If barcode exists, update or create cache
        if (data.barcode && data.barcode.trim()) {
            await BarcodeCache.findOneAndUpdate(
                { barcode: data.barcode.trim() },
                {
                    barcode: data.barcode.trim(),
                    name: data.name,
                    category: data.category,
                    storageLocation: data.storageLocation || 'N/A',
                },
                { upsert: true, new: true }
            );
            console.log('Barcode cache updated for:', data.barcode);
        }
        
        // Log change with timestamp
        await logChange('added', foodItem);
        console.log('Change logged for item:', foodItem._id);
        
        return response.status(201).send(foodItem);

    } catch (error) {
        console.error('Error creating food item:', error);
        return response.status(500).send({ 
            message: 'Error creating food item(s)',
            error: error.message 
        });
    }
});

const logChange = async (actionType, item, changes = null) => {
    const logEntry = new ChangeLog({
        actionType,
        itemId: item._id,
        itemName: item.name,
        category: item.category,
        changes,
        previousQuantity: actionType === 'deleted' ? item.quantity : undefined
    });
    await logEntry.save();
};


export default router;