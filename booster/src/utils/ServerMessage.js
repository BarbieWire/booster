class ServerMessage {
    /**
     * Represents a message from the server.
     * @param {string} status - action status
     * @param {object} content - The content of the message.
     * @param {string} content.message - message from server
     * @param {string} sender - Name of the handler.
     */
    constructor(message, sender, status) {
        this.status = status
        this.content = { "message": message };
        this.sender = sender;
    }

    /**
     * Get a string representation of the message.
     * @returns {string} - A formatted string representing the message.
     */
    toString() {
        return `Message from ${this.sender} (${this.timestamp.toLocaleString()}): ${this.content}`;
    }
}

module.exports = {
    ServerMessage
}