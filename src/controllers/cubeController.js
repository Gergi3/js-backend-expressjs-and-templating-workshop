const express = require('express');
const router = express.Router();

const cubeServices = require('../services/cubeServices');
const accessoryServices = require('../services/accessoryServices');

router.get('/create', (req, res) => {
    res.render('createCube');
});

router.post('/create', (req, res) => {
    const newCube = cubeServices.create(req.body);

    newCube.save()
        .then(() => {
            res.redirect('/');
        })
        .catch(() => {
            res.redirect('/404');
        });
});

router.get('/details/:cubeId', async (req, res) => {
    const cubeId = req.params.cubeId;
    const cube = await cubeServices.getByIdPopulatedAcessories(cubeId);

    res.render('detailsCube', {
        cube: cube.toObject(),
        hasAccessories: cube.accessories.length > 0,
    });
});

router.get('/attach-accessory/:cubeId', async (req, res) => {
    const cubeId = req.params.cubeId;
    const cube = await cubeServices.getById(cubeId);
    const accessories = await accessoryServices.getAllExcept(cube.accessories);
    
    res.render('attachAccessory', {
        cube: cube.toObject(),
        accessories,
        hasAllAccessories: accessories.length == 0,
    });
});

router.post('/attach-accessory/:cubeId', async (req, res) => {
    const cubeId = req.params.cubeId;
    const accessoryId = req.body.id;
    await cubeServices.addAccessory(cubeId, accessoryId);

    res.redirect(`/cube/details/${cubeId}`);
});

exports.cubeRouter = router;