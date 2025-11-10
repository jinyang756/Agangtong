import PocketBase from 'pocketbase';

// 初始化PocketBase客户端
const pb = new PocketBase('http://127.0.0.1:8090');

// 用户登录认证
export async function userLogin(usernameOrEmail, password) {
    try {
        const authData = await pb.collection('users').authWithPassword(usernameOrEmail, password);
        console.log('用户登录成功');
        return authData;
    } catch (error) {
        console.error('用户登录失败:', error);
        return null;
    }
}

// 创建订单
export async function createOrder(userId, stockCode, orderType, price, quantity) {
    try {
        // 确保已登录
        if (!pb.authStore.isValid) {
            await userLogin('testuser', 'test123456');
        }
        
        const order = await pb.collection('orders').create({
            user_id: userId,
            stock_code: stockCode,
            order_type: orderType,
            price: price,
            quantity: quantity,
            status: 'pending'  // 使用英文值
        });
        console.log('订单创建成功:', order);
        return order;
    } catch (error) {
        console.error('订单创建失败:', error);
        return null;
    }
}

// 获取订单列表
export async function getOrders() {
    try {
        // 确保已登录
        if (!pb.authStore.isValid) {
            await userLogin('testuser', 'test123456');
        }
        
        const orders = await pb.collection('orders').getFullList({
            sort: '-created'
        });
        return orders;
    } catch (error) {
        console.error('获取订单列表失败:', error);
        return [];
    }
}

// 创建投资组合记录
export async function createPortfolioRecord(userId, stockCode, quantity, avgPrice) {
    try {
        // 确保已登录
        if (!pb.authStore.isValid) {
            await userLogin('testuser', 'test123456');
        }
        
        const portfolio = await pb.collection('portfolio').create({
            user_id: userId,
            stock_code: stockCode,
            quantity: quantity,
            avg_price: avgPrice
        });
        console.log('投资组合记录创建成功:', portfolio);
        return portfolio;
    } catch (error) {
        console.error('投资组合记录创建失败:', error);
        return null;
    }
}

// 获取投资组合
export async function getPortfolio() {
    try {
        // 确保已登录
        if (!pb.authStore.isValid) {
            await userLogin('testuser', 'test123456');
        }
        
        const portfolio = await pb.collection('portfolio').getFullList({
            sort: '-created'
        });
        return portfolio;
    } catch (error) {
        console.error('获取投资组合失败:', error);
        return [];
    }
}

// 主函数
async function main() {
    console.log('开始测试PocketBase API...');
    
    // 登录用户
    const authData = await userLogin('testuser', 'test123456');
    if (!authData) {
        console.error('登录失败，无法继续测试');
        return;
    }
    
    // 获取用户信息
    const userId = authData.record.id;
    console.log('当前用户ID:', userId);
    
    // 创建订单（使用英文值）
    const order = await createOrder(userId, '000001', 'buy', 10.5, 100);
    
    // 获取订单列表
    const orders = await getOrders();
    console.log('订单列表:', orders);
    
    // 创建投资组合记录
    const portfolio = await createPortfolioRecord(userId, '000001', 100, 10.5);
    
    // 获取投资组合
    const portfolioList = await getPortfolio();
    console.log('投资组合:', portfolioList);
    
    console.log('API测试完成');
}

main();