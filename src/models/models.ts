import mongoose, {Schema} from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  conversations: [{ type: Schema.Types.ObjectId, ref: 'Conversation' }],
  token: {type: String, required: false}
}, {collection: 'user-data'}); 


const UserModel = mongoose.model('UserData', UserSchema)

const models = {
  User: UserModel,
};
  
export default models;