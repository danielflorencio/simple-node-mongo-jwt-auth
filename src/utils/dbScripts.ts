import { Conversations } from "../data/Conversations";
import models from "../models/models";
const User = models.User
const Conversation = models.Conversation;
const Message = models.Message;
const Customer = models.Customer;
const mongoose = require('mongoose')

async function createConversationAndMessage() {
    mongoose.connect('mongodb://localhost:27017/chatbot-application')
    try {
      for (let i = 0; i < Conversations.length; i++) {
        const user = await User.findOne({ email: Conversations[i].adminId });
        const customer = await Customer.create({ phoneNumber: Conversations[i].customerId });
        if(user){
            const messagesData = Conversations[i].messages.map((message) => ({
                content: message.content,
                customerReference: customer._id,
                adminReference: user._id,
                senderType: message.senderType,
                date: message.date,
              }));
              const messages = await Message.insertMany(messagesData);
              const conversationData = {
                messages: messages.map((message) => message._id),
                adminId: user._id,
                customerId: customer._id,
              };
              await Conversation.create(conversationData);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      mongoose.disconnect();
    }
}

// createConversationAndMessage();