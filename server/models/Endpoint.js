import mongoose from 'mongoose';
const endpointSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : [true, 'Endpoint must have a name'],
            trim : true,

        },
        url : {
            type : String,
            required : [true, 'Endpoint must have a URL'],

        },
        status : {
            type : String,
            enum : ['Up', 'Down', 'Pending'],
            default : 'Pending',
        },
        lastChecked : {
            type : Date,
            default : null,

        },
        owner : {
            type : mongoose.Schema.Types.ObjectId,
            requred : true,
            ref : 'User',

        },

    },
    {
        timestamps: true,
    }
);

const Endpoint = mongoose.model('Endpoint', endpointSchema);
export default Endpoint;