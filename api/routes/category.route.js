import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
    createCategory,
    updateCategory,
    deleteCategory,
    getallcategory,
    searchCategory,
} from '../controllers/category.controller.js';

const router = express.Router();

router.post('/create', createCategory);
router.put('/update/:id', verifyToken, updateCategory);
router.delete('/delete/:id/:userId', verifyToken, deleteCategory);
router.get('/getallcategory', getallcategory);
router.get('/filtercategory/search', searchCategory);

export default router;

