const PocketBase = require('pocketbase/cjs');

const pb = new PocketBase('http://127.0.0.1:8090');

async function initAdmin() {
    try {
        // 创建管理员账户
        const adminData = {
            email: 'admin@example.com',
            password: 'admin123',
            passwordConfirm: 'admin123'
        };

        const admin = await pb.admins.create(adminData);
        console.log('管理员账户创建成功:', admin);
        
        // 登录管理员账户
        await pb.admins.authWithPassword('admin@example.com', 'admin123');
        console.log('管理员登录成功');
    } catch (error) {
        console.error('初始化管理员账户失败:', error);
    }
}

initAdmin();