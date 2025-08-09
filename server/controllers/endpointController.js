import Endpoint from "../models/Endpoint.js"

const getEndPoints = async (req , res) => {
    try{
        const endpoints = await Endpoint.find({});
        res.json(endpoints);

    }
    catch(error){
        res.status(500).json({message : 'Server Error'});

    }
};

const createEndPoint = async(req, res) => {
    const { name, url } = req.body;
    if(!name || !url){
        return res.status(400).json({message : 'Please provide a name and URL'});
    }

    try{
        const newEndpoint = new Endpoint({
            name,
            url,
            owner : '66b21ea733b86536966050b1',
        });

        const savedEndpoint = await newEndpoint.save();
        res.status(201).json(savedEndpoint);

    }
    catch(error){
        res.status(500).json({message : 'Sever Error'});
    }
};

export {getEndPoints, createEndPoint};