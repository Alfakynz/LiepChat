const { collection, doc, getDocs, addDoc, deleteDoc, updateDoc, query, where } = require('firebase/firestore');

async function sendMessage(db, chatId, userId, content) {
  const chatsCollection = collection(db, 'chats');
  const chatQuery = query(chatsCollection, where("id", "==", chatId));

  try {
    const chatSnapshot = await getDocs(chatQuery);
    const chatDoc = chatSnapshot.docs[0];

    if (chatDoc) {
      const chatData = chatDoc.data();
      const messages = chatData.messages || [];

      const newMessage = {
        content: content,
        userId: userId,
        sendAt: new Date()
      };

      messages.push(newMessage);

      await updateDoc(chatDoc.ref, { messages: messages });
      return { success: true, message: 'Message envoyé avec succès' };
    } else {
      return { success: false, message: 'Chat non trouvé' };
    }
  } catch (error) {
    return { success: false, message: 'Erreur lors de l\'envoi du message', error: error };
  }
}

module.exports = { sendMessage };