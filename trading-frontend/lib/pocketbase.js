import PocketBase from 'pocketbase';

// 初始化PocketBase客户端
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

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

// 管理员登录认证
export async function adminLogin() {
    try {
        // 使用管理员账户登录
        const authData = await pb.admins.authWithPassword('admin@example.com', 'admin123');
        console.log('管理员登录成功');
        return true;
    } catch (error) {
        console.error('管理员登录失败:', error);
        return false;
    }
}

// 创建所有数据表
export async function createAllCollections() {
    // 确保已登录
    if (!pb.authStore.isValid) {
        const loginSuccess = await adminLogin();
        if (!loginSuccess) {
            console.error('请先登录管理员账户');
            return;
        }
    }

    // 获取现有集合列表
    let existingCollections = [];
    try {
        const collectionsList = await pb.collections.getFullList();
        existingCollections = collectionsList.map(collection => collection.name);
    } catch (error) {
        console.error('获取现有集合列表失败:', error);
    }

    // users表（用户账户）
    if (!existingCollections.includes('users')) {
        try {
            await pb.collections.create({
                name: 'users',
                type: 'auth',
                fields: [
                    {
                        name: 'username',
                        type: 'text',
                        required: true
                    },
                    {
                        name: 'email',
                        type: 'email',
                        required: true
                    },
                    {
                        name: 'password',
                        type: 'password',
                        required: true
                    },
                    {
                        name: 'balance',
                        type: 'number',
                        required: false
                    },
                    {
                        name: 'created',
                        type: 'date',
                        required: false
                    },
                    {
                        name: 'updated',
                        type: 'date',
                        required: false
                    }
                ]
            });
            console.log('users表创建成功');
        } catch (error) {
            console.error('users表创建失败:', error);
        }
    } else {
        console.log('users表已存在');
    }

    // orders表（交易订单）
    if (!existingCollections.includes('orders')) {
        try {
            await pb.collections.create({
                name: 'orders',
                type: 'base',
                fields: [
                    {
                        name: 'user_id',
                        type: 'relation',
                        required: true,
                        options: {
                            collectionId: 'users',
                            cascadeDelete: false
                        }
                    },
                    {
                        name: 'stock_code',
                        type: 'text',
                        required: true
                    },
                    {
                        name: 'order_type',
                        type: 'select',
                        required: true,
                        options: {
                            values: ['买入', '卖出']
                        }
                    },
                    {
                        name: 'price',
                        type: 'number',
                        required: true
                    },
                    {
                        name: 'quantity',
                        type: 'number',
                        required: true
                    },
                    {
                        name: 'status',
                        type: 'select',
                        required: true,
                        options: {
                            values: ['待处理', '已完成', '已取消']
                        }
                    },
                    {
                        name: 'created',
                        type: 'date',
                        required: false
                    },
                    {
                        name: 'updated',
                        type: 'date',
                        required: false
                    }
                ]
            });
            console.log('orders表创建成功');
        } catch (error) {
            console.error('orders表创建失败:', error);
        }
    } else {
        console.log('orders表已存在');
    }

    // portfolio表（投资组合）
    if (!existingCollections.includes('portfolio')) {
        try {
            await pb.collections.create({
                name: 'portfolio',
                type: 'base',
                fields: [
                    {
                        name: 'user_id',
                        type: 'relation',
                        required: true,
                        options: {
                            collectionId: 'users',
                            cascadeDelete: false
                        }
                    },
                    {
                        name: 'stock_code',
                        type: 'text',
                        required: true
                    },
                    {
                        name: 'quantity',
                        type: 'number',
                        required: true
                    },
                    {
                        name: 'avg_price',
                        type: 'number',
                        required: true
                    },
                    {
                        name: 'created',
                        type: 'date',
                        required: false
                    },
                    {
                        name: 'updated',
                        type: 'date',
                        required: false
                    }
                ]
            });
            console.log('portfolio表创建成功');
        } catch (error) {
            console.error('portfolio表创建失败:', error);
        }
    } else {
        console.log('portfolio表已存在');
    }

    // market_data表（市场数据）
    if (!existingCollections.includes('market_data')) {
        try {
            await pb.collections.create({
                name: 'market_data',
                type: 'base',
                fields: [
                    {
                        name: 'stock_code',
                        type: 'text',
                        required: true
                    },
                    {
                        name: 'name',
                        type: 'text',
                        required: true
                    },
                    {
                        name: 'current_price',
                        type: 'number',
                        required: true
                    },
                    {
                        name: 'change',
                        type: 'number',
                        required: false
                    },
                    {
                        name: 'change_percent',
                        type: 'number',
                        required: false
                    },
                    {
                        name: 'open',
                        type: 'number',
                        required: false
                    },
                    {
                        name: 'high',
                        type: 'number',
                        required: false
                    },
                    {
                        name: 'low',
                        type: 'number',
                        required: false
                    },
                    {
                        name: 'volume',
                        type: 'number',
                        required: false
                    },
                    {
                        name: 'market_type',
                        type: 'select',
                        required: true,
                        options: {
                            values: ['A股', '港股']
                        }
                    },
                    {
                        name: 'market_cap',
                        type: 'number',
                        required: false
                    },
                    {
                        name: 'pe_ratio',
                        type: 'number',
                        required: false
                    },
                    {
                        name: 'pb_ratio',
                        type: 'number',
                        required: false
                    },
                    {
                        name: 'dividend_yield',
                        type: 'number',
                        required: false
                    },
                    {
                        name: 'high_52w',
                        type: 'number',
                        required: false
                    },
                    {
                        name: 'low_52w',
                        type: 'number',
                        required: false
                    },
                    {
                        name: 'created',
                        type: 'date',
                        required: false
                    },
                    {
                        name: 'updated',
                        type: 'date',
                        required: false
                    }
                ]
            });
            console.log('market_data表创建成功');
        } catch (error) {
            console.error('market_data表创建失败:', error);
        }
    } else {
        console.log('market_data表已存在');
    }

    // intraday_data表（分时数据）
    if (!existingCollections.includes('intraday_data')) {
        try {
            await pb.collections.create({
                name: 'intraday_data',
                type: 'base',
                fields: [
                    {
                        name: 'stock_code',
                        type: 'text',
                        required: true
                    },
                    {
                        name: 'timestamp',
                        type: 'date',
                        required: true
                    },
                    {
                        name: 'price',
                        type: 'number',
                        required: true
                    },
                    {
                        name: 'volume',
                        type: 'number',
                        required: true
                    },
                    {
                        name: 'amount',
                        type: 'number',
                        required: true
                    }
                ]
            });
            console.log('intraday_data表创建成功');
        } catch (error) {
            console.error('intraday_data表创建失败:', error);
        }
    } else {
        console.log('intraday_data表已存在');
    }

    // technical_indicators表（技术指标）
    if (!existingCollections.includes('technical_indicators')) {
        try {
            await pb.collections.create({
                name: 'technical_indicators',
                type: 'base',
                fields: [
                    {
                        name: 'stock_code',
                        type: 'text',
                        required: true
                    },
                    {
                        name: 'timestamp',
                        type: 'date',
                        required: true
                    },
                    {
                        name: 'macd',
                        type: 'number',
                        required: false
                    },
                    {
                        name: 'signal',
                        type: 'number',
                        required: false
                    },
                    {
                        name: 'histogram',
                        type: 'number',
                        required: false
                    },
                    {
                        name: 'rsi',
                        type: 'number',
                        required: false
                    },
                    {
                        name: 'ma5',
                        type: 'number',
                        required: false
                    },
                    {
                        name: 'ma10',
                        type: 'number',
                        required: false
                    },
                    {
                        name: 'ma20',
                        type: 'number',
                        required: false
                    }
                ]
            });
            console.log('technical_indicators表创建成功');
        } catch (error) {
            console.error('technical_indicators表创建失败:', error);
        }
    } else {
        console.log('technical_indicators表已存在');
    }
}

// 创建示例用户
export async function createSampleUser() {
    // 检查是否已存在示例用户
    try {
        const existingUsers = await pb.collection('users').getFullList({
            filter: 'username="testuser"'
        });
        
        if (existingUsers.length > 0) {
            console.log('示例用户已存在');
            return existingUsers[0];
        }
    } catch (error) {
        console.error('检查示例用户失败:', error);
    }
    
    try {
        const user = await pb.collection('users').create({
            username: 'testuser',
            email: 'test@example.com',
            password: 'test123456',
            passwordConfirm: 'test123456'
            // 资金由后端管理，不在创建用户时设置
        });
        console.log('示例用户创建成功:', user);
        return user;
    } catch (error) {
        console.error('示例用户创建失败:', error);
    }
}

// 获取用户列表
export async function getUsers() {
    try {
        // 确保已登录
        if (!pb.authStore.isValid) {
            await userLogin('testuser', 'test123456');
        }
        
        const users = await pb.collection('users').getFullList({
            sort: '-created'
        });
        return users;
    } catch (error) {
        console.error('获取用户列表失败:', error);
        return [];
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
            status: '待处理'
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

// 导出PocketBase实例供其他模块使用
export default pb;