import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
    },
    { strict: true }
);

const Profile = mongoose.model('Profile', profileSchema);

profileSchema.index({ name: 1 });

export default Profile;
