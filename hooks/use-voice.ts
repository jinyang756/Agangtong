import { useEffect, useState } from 'react';

export const useVoiceTrading = () => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // 确保只在客户端初始化语音识别
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const speechRecognition = new (window as any).webkitSpeechRecognition();
      speechRecognition.continuous = false;
      speechRecognition.lang = 'zh-CN';
      
      speechRecognition.onresult = (event: any) => {
        const command = event.results[0][0].transcript;
        parseVoiceCommand(command);
      };
      
      setRecognition(speechRecognition);
    }
  }, []);

  const parseVoiceCommand = (command: string) => {
    // 解析语音指令："买入000001，价格10.5，数量100"
    const match = command.match(/(买入|卖出)([\d]{6})，价格?([\d.]+)，数量?([\d]+)/);
    if (match) {
      const [, action, code, price, quantity] = match;
      return {
        type: action === '买入' ? 'buy' : 'sell',
        stockCode: code,
        price: parseFloat(price),
        quantity: parseInt(quantity),
      };
    }
    return null;
  };

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  };

  return { isListening, startListening, parseVoiceCommand };
};