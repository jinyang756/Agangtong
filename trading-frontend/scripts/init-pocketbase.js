import { createAllCollections, createSampleUser, userLogin } from '../lib/pocketbase.js';

async function initPocketBase() {
    console.log('开始初始化PocketBase数据表...');
    
    // 创建所有数据表
    await createAllCollections();
    
    // 创建示例用户
    await createSampleUser();
    
    // 登录示例用户
    await userLogin('testuser', 'test123456');
    
    console.log('PocketBase初始化完成');
}

initPocketBase();