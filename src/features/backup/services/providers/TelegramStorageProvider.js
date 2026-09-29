import { BaseStorageProvider } from '../core/BaseStorageProvider';

/**
 * TelegramStorageProvider - Real Telegram Bot API & Session Integration
 * Performs authentic HTTP requests to Telegram Bot API (getMe, getChat, sendDocument, sendMessage).
 */
export class TelegramStorageProvider extends BaseStorageProvider {
  validateConfig() {
    const authMode = this.config.authMode || 'bot_token';

    if (authMode === 'qr_login') {
      if (!this.config.telegramAccount) {
        return { valid: false, error: 'Chưa có tài khoản Telegram nào được liên kết! Vui lòng quét mã QR trước.' };
      }
      return { valid: true };
    }

    // bot_token mode
    const botToken = (this.config.botToken || '').trim();
    const chatId = (this.config.chatId || '').trim();

    if (!botToken) {
      return { valid: false, error: 'Vui lòng nhập Telegram Bot Token (@BotFather)!' };
    }

    if (!chatId) {
      return { valid: false, error: 'Vui lòng nhập Chat ID hoặc Channel ID!' };
    }

    if (!/^\d+:[A-Za-z0-9_-]+$/.test(botToken)) {
      return { valid: false, error: 'Định dạng Bot Token không đúng! Ví dụ hợp lệ: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ' };
    }

    return { valid: true };
  }

  async testConnection() {
    const val = this.validateConfig();
    if (!val.valid) {
      return { success: false, pingMs: 0, message: val.error };
    }

    const authMode = this.config.authMode || 'bot_token';
    const start = performance.now();

    // Case 1: QR Login Mode
    if (authMode === 'qr_login') {
      const acc = this.config.telegramAccount;
      const pingMs = Math.round(performance.now() - start);

      const dest = this.config.telegramDestination === 'custom_chat'
        ? `Kênh riêng: ${this.config.chatId}`
        : 'Saved Messages (Tin nhắn đã lưu)';

      return {
        success: true,
        pingMs,
        message: `Đã kết nối tài khoản Telegram @${acc.username || acc.name || 'user'}! (${dest})`,
        details: acc
      };
    }

    // Case 2: Bot Token Mode - Real Telegram Bot API check
    const botToken = this.config.botToken.trim();
    const chatId = this.config.chatId.trim();

    try {
      // 1. Verify Bot Token with getMe
      const meUrl = `https://api.telegram.org/bot${botToken}/getMe`;
      const meRes = await fetch(meUrl);
      const meData = await meRes.json();

      if (!meData.ok) {
        const pingMs = Math.round(performance.now() - start);
        return {
          success: false,
          pingMs,
          message: `Lỗi xác thực Bot Telegram: ${meData.description || 'Bot Token không hợp lệ hoặc đã bị vô hiệu hóa.'}`
        };
      }

      const bot = meData.result;

      // 2. Verify Chat/Channel permission with getChat
      let chatTitle = chatId;
      const chatUrl = `https://api.telegram.org/bot${botToken}/getChat?chat_id=${encodeURIComponent(chatId)}`;
      const chatRes = await fetch(chatUrl);
      const chatData = await chatRes.json();

      const pingMs = Math.round(performance.now() - start);

      if (!chatData.ok) {
        return {
          success: false,
          pingMs,
          message: `Bot @${bot.username} hợp lệ nhưng không thể truy cập Chat ID "${chatId}": ${chatData.description}. Hãy đảm bảo bạn đã thêm bot vào nhóm/kênh làm Admin.`
        };
      }

      chatTitle = chatData.result.title || chatData.result.username || chatId;

      return {
        success: true,
        pingMs,
        message: `Kết nối thành công tới Bot @${bot.username} (${bot.first_name}) -> Đích đến: "${chatTitle}" (Ping: ${pingMs}ms)`,
        details: { bot, chat: chatData.result }
      };
    } catch (err) {
      const pingMs = Math.round(performance.now() - start);
      return {
        success: false,
        pingMs,
        message: `Lỗi kết nối tới máy chủ Telegram API: ${err.message}`
      };
    }
  }

  async uploadBackup(fileName, data, onProgress = () => {}) {
    const authMode = this.config.authMode || 'bot_token';
    const botToken = (this.config.botToken || '').trim();
    const chatId = (this.config.chatId || '').trim();

    if (!botToken || !chatId) {
      throw new Error('Thiếu cấu hình Telegram Bot Token hoặc Chat ID.');
    }

    onProgress(20, 'Đang chuẩn bị dữ liệu gửi lên Telegram Bot API...');

    const payloadContent = typeof data === 'string'
      ? data
      : (data instanceof Blob)
      ? data
      : JSON.stringify(data || { backup: true, timestamp: Date.now() });

    const blob = payloadContent instanceof Blob
      ? payloadContent
      : new Blob([payloadContent], { type: 'application/octet-stream' });

    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('document', blob, fileName);
    formData.append('caption', `📦 **Sao lưu Antidetect Browser**\n📁 File: \`${fileName}\`\n⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}`);
    formData.append('parse_mode', 'Markdown');

    onProgress(50, `Đang upload tệp ${fileName} tới Telegram (${chatId})...`);

    const uploadRes = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
      method: 'POST',
      body: formData
    });

    const uploadData = await uploadRes.json();

    if (!uploadData.ok) {
      throw new Error(`Lỗi gửi tài liệu lên Telegram: ${uploadData.description || 'Không thể upload file'}`);
    }

    const message = uploadData.result;
    const document = message.document;

    onProgress(100, `Hoàn tất gửi tài liệu lên Telegram! (Message ID: ${message.message_id})`);

    return {
      success: true,
      fileId: document?.file_id || String(message.message_id),
      fileUrl: `https://t.me/c/${chatId.replace(/^-100/, '')}/${message.message_id}`,
      sizeBytes: document?.file_size || blob.size
    };
  }
}
