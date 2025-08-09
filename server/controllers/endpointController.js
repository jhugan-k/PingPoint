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

const getEndpointById = async(req,res) => {
    try{
        const endpoint = await Endpoint.findById(req.params.id);
        if(endpoint){
            res.json(endpoint);

        }
        else{
        res.status(404).json({message : 'Endpoint not found'});
        }
    }
    catch(error){
        res.status(500).json({message : "Server error"});

    }
};

const updateEndPoint = async(req, res) => {
    const {name, url} = req.body;
    try{
        const endpoint = await Endpoint.findById(req.params.id);
        if(endpoint){
            endpoint.name = name || endpoint.name;
            endpoint.url = url || endpoint.url;

            const updateEndPoint = await endpoint.save();
            res.json(updateEndPoint);

        }
        else{
            res.status(404).json({message : 'Endpoint not found'});
        }

    }
    catch(error){
        res.status(500).json({message : 'Server error'});

    }
};

const deleteEndPoint = async(req,res) => {
    try{
        const endpoint = await Endpoint.findById(req.params.id);
        if(endpoint){
            await endpoint.deleteOne();
            res.json({message : 'Endpoint removed'});

        }
        else{
            res.status(404).json({message : 'Endpoint not found'});

        }
        
    }
    catch(error){
        res.status(500).json({message : 'Server error'});
    }

};

export {
        getEndPoints,
        createEndPoint,
        getEndpointById,
        updateEndPoint,
        deleteEndPoint,
};