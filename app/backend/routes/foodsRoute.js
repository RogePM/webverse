import express from 'express';
import { FoodItem, BarcodeCache } from '../models/FoodItemModel.js';
import { ChangeLog } from '../models/ChangeLogModel.js';
import { ClientDistribution } from '../models/ClientDistributionModel.js';

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

// NEW: Route for logging distributions
router.post('/log-distribution', async (request, response) => {
    try {
        const { 
            itemId, 
            itemName, 
            category, 
            removedQuantity, 
            unit,
            reason, 
            clientName, 
            clientId 
        } = request.body;

        // Validate required fields
        if (!itemName || !category || !removedQuantity || !reason || !clientName) {
            return response.status(400).json({ 
                message: 'Missing required fields: itemName, category, removedQuantity, reason, clientName' 
            });
        }

        // Create client distribution record
        const distribution = new ClientDistribution({
            clientName: clientName.trim(),
            clientId: clientId?.trim() || undefined,
            itemName,
            itemId: itemId || undefined,
            category,
            quantityDistributed: removedQuantity,
            unit: unit || 'units',
            reason,
            distributionDate: new Date(),
        });

        await distribution.save();

        // Also log in ChangeLog for timeline
        const logEntry = new ChangeLog({
            actionType: 'distributed',
            itemId: itemId || undefined,
            itemName,
            category,
            removedQuantity,
            distributionReason: reason,
            clientName: clientName.trim(),
            clientId: clientId?.trim() || undefined,
            unit: unit || 'units',
        });

        await logEntry.save();

        return response.status(201).json({ 
            message: 'Distribution logged successfully',
            distribution 
        });
    } catch (error) {
        console.error('Error logging distribution:', error);
        return response.status(500).send({ 
            message: 'Error logging distribution',
            error: error.message 
        });
    }
});

// NEW: Get all client distributions
router.get('/distributions', async (request, response) => {
    try {
        const distributions = await ClientDistribution.find()
            .sort({ distributionDate: -1 })
            .limit(100);
        
        return response.status(200).json({
            count: distributions.length,
            data: distributions
        });
    } catch (error) {
        console.error('Error fetching distributions:', error);
        return response.status(500).send({ message: 'Error fetching distributions' });
    }
});

// NEW: Get distributions by client name
router.get('/distributions/client/:name', async (request, response) => {
    try {
        const { name } = request.params;
        const distributions = await ClientDistribution.find({
            clientName: new RegExp(name, 'i')
        }).sort({ distributionDate: -1 });
        
        return response.status(200).json({
            count: distributions.length,
            data: distributions
        });
    } catch (error) {
        console.error('Error fetching client distributions:', error);
        return response.status(500).send({ message: 'Error fetching client distributions' });
    }
});

// NEW: Get distribution summary by client
router.get('/distributions/summary', async (request, response) => {
    try {
        const summary = await ClientDistribution.aggregate([
            {
                $group: {
                    _id: { clientName: '$clientName', clientId: '$clientId' },
                    totalDistributions: { $sum: 1 },
                    totalQuantity: { $sum: '$quantityDistributed' },
                    lastDistribution: { $max: '$distributionDate' },
                    items: { 
                        $push: {
                            itemName: '$itemName',
                            quantity: '$quantityDistributed',
                            date: '$distributionDate'
                        }
                    }
                }
            },
            { $sort: { 'lastDistribution': -1 } }
        ]);

        return response.status(200).json({
            count: summary.length,
            data: summary
        });
    } catch (error) {
        console.error('Error fetching distribution summary:', error);
        return response.status(500).send({ message: 'Error fetching distribution summary' });
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

// UPDATED: Route for delete food item with distribution tracking
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const { reason, clientName, clientId, removedQuantity, unit } = request.query;

        const result = await FoodItem.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: 'Food item not found' });
        }

        // If client info provided, log distribution
        if (clientName && clientName.trim()) {
            const distribution = new ClientDistribution({
                clientName: clientName.trim(),
                clientId: clientId?.trim() || undefined,
                itemName: result.name,
                itemId: result._id,
                category: result.category,
                quantityDistributed: parseInt(removedQuantity) || result.quantity,
                unit: unit || 'units',
                reason: reason || 'deleted',
            });
            await distribution.save();
        }

        // Log deletion with metadata
        await logChange('deleted', result, null, {
            reason,
            clientName,
            clientId,
            removedQuantity: removedQuantity || result.quantity,
            unit
        });

        return response.status(200).send({ message: 'Food item deleted successfully' });
    } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: 'Error deleting food item' });
    }
});

router.post('/', async (request, response) => {
    try {
        const data = request.body;

        // Helper function to validate a food item
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

// UPDATED: logChange function with metadata support
const logChange = async (actionType, item, changes = null, metadata = {}) => {
    const logEntry = new ChangeLog({
        actionType,
        itemId: item._id,
        itemName: item.name,
        category: item.category,
        changes,
        previousQuantity: actionType === 'deleted' ? item.quantity : undefined,
        // Add distribution metadata
        distributionReason: metadata.reason,
        clientName: metadata.clientName,
        clientId: metadata.clientId,
        removedQuantity: metadata.removedQuantity,
        unit: metadata.unit
    });
    await logEntry.save();
};

export default router;