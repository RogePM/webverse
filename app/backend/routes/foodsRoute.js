import express from 'express';
import { FoodItem, BarcodeCache } from '../models/FoodItemModel.js';
import { ChangeLog } from '../models/ChangeLogModel.js';
import { ClientDistribution } from '../models/ClientDistributionModel.js';

const router = express.Router();

// =========================================================
// 🛡️ MIDDLEWARE: Require Pantry ID
// =========================================================
const requirePantryId = (req, res, next) => {
    const pantryId = req.headers['x-pantry-id'];
    if (!pantryId) {
        return res.status(400).json({ message: 'Missing x-pantry-id header' });
    }
    req.pantryId = pantryId;
    next();
};

router.use(requirePantryId);

// =========================================================
// 🛠️ HELPER: Log Changes
// =========================================================
const logChange = async (actionType, item, changes = null, metadata = {}, pantryId) => {
    try {
        const logEntry = new ChangeLog({
            pantryId,
            actionType,
            itemId: item._id,
            itemName: item.name,
            category: item.category,
            changes,
            previousQuantity: actionType === 'deleted' ? item.quantity : undefined,

            distributionReason: metadata.reason,
            clientName: metadata.clientName,
            clientId: metadata.clientId,
            removedQuantity: metadata.removedQuantity,
            unit: metadata.unit
        });
        await logEntry.save();
    } catch (error) {
        console.error('Failed to create change log:', error);
    }
};

// =========================================================
// 🚨 SPECIFIC ROUTES (MUST COME BEFORE /:id)
// =========================================================

// 1. Distributions List
router.get('/distributions', async (req, res) => {
    try {
        const distributions = await ClientDistribution.find({ pantryId: req.pantryId })
            .sort({ distributionDate: -1 })
            .limit(100);
        return res.status(200).json({ count: distributions.length, data: distributions });
    } catch (error) {
        return res.status(500).send({ message: 'Error fetching distributions' });
    }
});

// 2. Recent Changes
router.get('/changes/recent', async (req, res) => {
    try {
        const changes = await ChangeLog.find({ pantryId: req.pantryId }).sort({ timestamp: -1 }).limit(50);
        return res.status(200).json(changes);
    } catch (error) {
        return res.status(500).send({ message: 'Error fetching changes' });
    }
});

// 3. Barcode Lookup
router.get('/barcode/:code', async (req, res) => {
    try {
        const cached = await BarcodeCache.findOne({ barcode: req.params.code, pantryId: req.pantryId });
        if (cached) return res.status(200).json({ found: true, data: cached });
        return res.status(200).json({ found: false, data: null });
    } catch (error) {
        return res.status(500).send({ message: 'Error looking up barcode' });
    }
});

// 4. Log Distribution (POST)
router.post('/log-distribution', async (req, res) => {
    try {
        const distribution = new ClientDistribution({
            ...req.body,
            pantryId: req.pantryId,
            distributionDate: new Date(),
        });
        await distribution.save();

        await logChange('distributed', {
            _id: req.body.itemId,
            name: req.body.itemName,
            category: req.body.category
        }, null, {
            reason: req.body.reason,
            clientName: req.body.clientName,
            clientId: req.body.clientId,
            removedQuantity: req.body.removedQuantity,
            unit: req.body.unit
        }, req.pantryId);

        return res.status(201).json({ message: 'Logged', distribution });
    } catch (error) {
        return res.status(500).send({ message: 'Error logging distribution' });
    }
});

// 5. Distribution Specific Operations (Update/Delete)
router.put('/distribution/:id', async (req, res) => {
    try {
        const result = await ClientDistribution.findOneAndUpdate(
            { _id: req.params.id, pantryId: req.pantryId },
            req.body,
            { new: true }
        );
        if (!result) return res.status(404).json({ message: 'Record not found' });
        return res.status(200).json({ message: 'Updated', data: result });
    } catch (error) {
        return res.status(500).send({ message: 'Error updating record' });
    }
});

router.delete('/distribution/:id', async (req, res) => {
    try {
        const result = await ClientDistribution.findOneAndDelete({ _id: req.params.id, pantryId: req.pantryId });
        if (!result) return res.status(404).json({ message: 'Record not found' });
        return res.status(200).json({ message: 'Deleted' });
    } catch (error) {
        return res.status(500).send({ message: 'Error deleting record' });
    }
});


// =========================================================
// 📦 MAIN FOOD ROUTES
// =========================================================

// GET All Foods
router.get('/', async (req, res) => {
    try {
        const foods = await FoodItem.find({ pantryId: req.pantryId });
        return res.status(200).json({ count: foods.length, data: foods });
    } catch (error) {
        return res.status(500).send({ message: 'Error fetching food items' });
    }
});

// POST New Food
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const prepareItem = (item) => {
            // Process barcode: convert empty/whitespace to undefined
            let barcode = undefined;
            if (item.barcode && typeof item.barcode === 'string') {
                const trimmed = item.barcode.trim();
                if (trimmed.length > 0) {
                    barcode = trimmed;
                }
            }

            return {
                ...item,
                pantryId: req.pantryId,
                lastModified: new Date(),
                barcode: barcode, // Will be undefined if empty
            };
        };

        if (Array.isArray(data)) {
            const validItems = data.map(prepareItem);
            const createdItems = await FoodItem.create(validItems);
            for (const item of createdItems) {
                await logChange('added', item, null, {}, req.pantryId);
            }
            return res.status(201).send(createdItems);
        } else {
            const newItemData = prepareItem(data);
            const foodItem = await FoodItem.create(newItemData);
            
            // Only cache if barcode exists
            if (newItemData.barcode) {
                await BarcodeCache.findOneAndUpdate(
                    { barcode: newItemData.barcode, pantryId: req.pantryId },
                    { ...newItemData, pantryId: req.pantryId },
                    { upsert: true, new: true }
                );
            }
            
            await logChange('added', foodItem, null, {}, req.pantryId);
            return res.status(201).send(foodItem);
        }
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).send({ message: 'Barcode already exists in this pantry' });
        }
        return res.status(500).send({ message: 'Error creating item', error: error.message });
    }
});

// =========================================================
// ⚠️ DYNAMIC ROUTES (MUST BE LAST)
// =========================================================

// GET Single Item (/:id) - Takes priority last!
router.get('/:id', async (req, res) => {
    try {
        const food = await FoodItem.findOne({ _id: req.params.id, pantryId: req.pantryId });
        if (!food) return res.status(404).json({ message: 'Food item not found' });
        return res.status(200).json(food);
    } catch (error) {
        return res.status(500).send({ message: 'Error fetching food item' });
    }
});

// PUT Item
router.put('/:id', async (req, res) => {
    try {
        const oldItem = await FoodItem.findOne({ _id: req.params.id, pantryId: req.pantryId });
        if (!oldItem) return res.status(404).json({ message: 'Item not found' });

        const updateData = { ...req.body, lastModified: new Date() };
        const result = await FoodItem.findOneAndUpdate(
            { _id: req.params.id, pantryId: req.pantryId },
            updateData,
            { new: true }
        );

        const changes = {};
        for (const key of Object.keys(updateData)) {
            if (key !== 'lastModified' && key !== '_id' && oldItem[key] != updateData[key]) {
                changes[key] = { old: oldItem[key], new: updateData[key] };
            }
        }

        if (Object.keys(changes).length > 0) {
            await logChange('updated', result, changes, {}, req.pantryId);
        }

        return res.status(200).send({ message: 'Item updated', data: result });
    } catch (error) {
        return res.status(500).send({ message: 'Error updating item' });
    }
});

// DELETE Item
router.delete('/:id', async (req, res) => {
    try {
        const { reason, clientName, clientId, removedQuantity, unit } = req.query;
        const result = await FoodItem.findOneAndDelete({ _id: req.params.id, pantryId: req.pantryId });

        if (!result) return res.status(404).json({ message: 'Item not found' });

        if (clientName && clientName.trim()) {
            const distribution = new ClientDistribution({
                pantryId: req.pantryId,
                clientName: clientName.trim(),
                clientId: clientId?.trim(),
                itemName: result.name,
                itemId: result._id,
                category: result.category,
                quantityDistributed: parseInt(removedQuantity) || result.quantity,
                unit: unit || 'units',
                reason: reason || 'deleted',
            });
            await distribution.save();
        }

        await logChange('deleted', result, null, { reason, clientName, clientId, removedQuantity, unit }, req.pantryId);
        return res.status(200).send({ message: 'Item deleted' });
    } catch (error) {
        return res.status(500).send({ message: 'Error deleting item' });
    }
});

export default router;