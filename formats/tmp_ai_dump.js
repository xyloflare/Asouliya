async function ai_handler(message, argsArray, client) {
  let args = argsArray;
  await message.channel.sendTyping();

  if (args.toLowerCase() == "start-chat" || args.toLowerCase() == "chat") {
    if (client.chatHistory.get(message.channel.id)) {
      return message.channel.send(
        "Chat is already going on. Use `bye` to clear.",
      );
    }
    client.chatHistory.set(message.channel.id, {
      lastMsg: Date.now(),
      history: [],
    });
    await message.channel.send(
      "Hello! \nUse `reset-chat` or `bye` to clear history.",
    );
    return;
  }
  if (args.toLowerCase() == "reset-chat" || args.toLowerCase() == "bye") {
    if (client.chatHistory.get(message.channel.id)) {
      client.chatHistory.delete(message.channel.id);
      message.channel.send("Cleared history");
      return;
    }
  }
  ai_model(message, args, message.channel, client);
}
