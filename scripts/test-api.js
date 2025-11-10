import pb, { userLogin, getUsers, createOrder, getOrders, createPortfolioRecord, getPortfolio } from '../lib/pocketbase.js';

async function testAPI() {
    console.log('开始测试PocketBase API...');
    
    // 登录用户
    await userLogin('testuser', 'test123456');
    
    // 获取用户列表
    const users = await getUsers();
    console.log('用户列表:', users);
    
    // 创建订单
    const order = await createOrder(users[0].id, '000001', '买入', 10.5, 100);
    console.log('创建的订单:', order);
    
    // 获取订单列表
    const orders = await getOrders();
    console.log('订单列表:', orders);
    
    // 创建投资组合记录
    const portfolio = await createPortfolioRecord(users[0].id, '000001', 100, 10.5);
    console.log('创建的投资组合记录:', portfolio);
    
    // 获取投资组合
    const portfolioList = await getPortfolio();
    console.log('投资组合:', portfolioList);
    
    console.log('API测试完成');
}

testAPI();