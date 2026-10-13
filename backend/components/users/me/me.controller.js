import * as MeService from './me.service.js';
import generateJewelryPdf from '../../../helpers/pdf/pdf-generator.js';
import path from 'path';
import fs from 'fs';

export const getJewels = async (req, res) => {
    const jewels = await MeService.findJewels({ userId: req.session._id });
    res.status(200).json({ result: 'OK', jewels });
};

export const getJewelById = async (req, res) => {
    const jewel = await MeService.findJewelById({
        userId: req.session._id,
        jewelId: req.params.jewelId,
    });
    res.status(200).json({ result: 'OK', jewel });
};

export const getPhotoOfMyJewelByJewelId = async (req, res) => {
    try {
        const { jewelId } = req.params;
        const userId = req.session._id;

        const jewel = await MeService.findJewelById({ userId, jewelId });

        const filename = jewel?.snapshot;

        const defaultPath = path.join(process.cwd(), 'public', 'captures', 'anillo_solitario.png');

        if (filename) {
            const filePath = path.join(process.cwd(), 'public', 'captures', filename);

            if (fs.existsSync(filePath)) {
                return res.sendFile(filePath);
            }
        }
        return res.sendFile(defaultPath);
        
    } catch (error) {
        // Si findJewelById lanza error (no es su joya), lo capturamos aquí
        res.status(error.status || 500).json({ message: error.message });
    }
};


export const getPDFOfMyJewelByJewelId = async (req, res) => {
    try {
        const withPricebool = req.query.withPrice === 'true';
        const jewel = await MeService.findJewelById({
          userId: req.session._id,
          jewelId: req.params.jewelId,
        });
        
        const pdfBytes = await generateJewelryPdf(jewel, withPricebool);

        res.setHeader('Content-Disposition', `inline; filename=Ficha_${jewel.name}.pdf`);

        return res.end(pdfBytes);
    } catch (error) {
        res.status(500).send('Error al generar el PDF');
    }
};

export const getOrders = async (req, res) => {
    const orders = await MeService.findOrders({ userId: req.session._id });
    res.status(200).json({ result: 'OK', orders });
};

export const getOrderById = async (req, res) => {
    const order = await MeService.findOrderById({
        userId: req.session._id,
        orderId: req.params.orderId,
    });
    res.status(200).json({ result: 'OK', order });
};

export const getPhotoOfMyJewelByOrderProductId = async (req, res) => {
    try {
        const { orderId, productId } = req.params;
        const userId = req.session._id;

        const order = await MeService.findOrderById({ userId, orderId });

        if (!order || !order.products) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        const product = order.products.find(p => p._id.toString() === productId);

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado en el pedido" });
        }

        const snapshotValue = product.snapshot; 
        
        // Definimos la ruta por defecto
        const defaultPath = path.join(process.cwd(), 'public', 'captures', 'anillo_solitario.png');

        if (snapshotValue) {
            // normalizar por si acaso la ruta no es solo el nombre
            const filename = snapshotValue.replace('captures/', '');
            const filePath = path.join(process.cwd(), 'public', 'captures', filename);

            if (fs.existsSync(filePath)) {
                return res.sendFile(filePath);
            }
        }

        //  Si no hay snapshot o el archivo no existe, enviamos la imagen por defecto
        return res.sendFile(defaultPath);
        
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

export const deleteUserById = async (req, res) => {
    await MeService.deleteUserById({
        userId: req.session._id,
        userDeleteData: req.body,
    });
    res.status(204).end();
};

export const updateUserById = async (req, res) => {
    const user = await MeService.updateUserById({
        userId: req.session._id,
        userUpdateData: req.body,
    });
    res.status(200).json({ result: 'OK', user });
};

export const updateJewelById = async (req, res) => {
    const jewel = await MeService.updateJewelById({
        userId: req.session._id,
        jewelId: req.params.jewelId,
        jewelUpdateData: req.body,
    });
    res.status(200).json({ result: 'OK', jewel });
};

export const updateJewelNameById = async (req, res) => {
    const jewel = await MeService.updateJewelNameById({
        userId: req.session._id,
        jewelId: req.params.jewelId,
        jewelUpdateData: req.body,
    });
    res.status(200).json({ result: 'OK', jewel });
};

export const updateJewelShareHashWithPriceById = async (req, res) => {
    const shareHashWithPrice = await MeService.updateJewelShareHashWithPriceById({
        userId: req.session._id,
        jewelId: req.params.jewelId,
    });
    res.status(200).json({ result: 'OK', shareHashWithPrice });
};

export const updateJewelShareHashWithoutPriceById = async (req, res) => {
    const shareHashWithoutPrice = await MeService.updateJewelShareHasheWithoutPriceById({
        userId: req.session._id,
        jewelId: req.params.jewelId,
    });
    res.status(200).json({ result: 'OK', shareHashWithoutPrice });
};

export const deleteJewelById = async (req, res) => {
    await MeService.deleteJewelById({
        userId: req.session._id,
        jewelId: req.params.jewelId,
    });
    res.status(204).end();
};

export const deleteOrderById = async (req, res) => {
    await MeService.deleteOrderById({
        userId: req.session._id,
        orderId: req.params.orderId,
    });
    res.status(204).end();
};
