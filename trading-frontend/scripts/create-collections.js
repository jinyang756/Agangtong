import PocketBase from 'pocketbase';

// 初始化PocketBase客户端
const pb = new PocketBase('http://127.0.0.1:8090');

// 管理员登录认证
export async function adminLogin() {
    try {
        // 使用正确的认证端点
        const authData = await pb.admins.authWithPassword('admin@example.com', 'admin123');
        console.log('管理员登录成功');
        return true;
    } catch (error) {
        console.error('管理员登录失败:', error);
        return false;
    }
}

// 创建投资组合集合
async function createPortfolioCollection() {
    try {
        await pb.collections.create({
            name: 'portfolio',
            type: 'base',
            schema: [
                {
                    name: 'user_id',
                    type: 'relation',
                    options: {
                        collectionId: '_pb_users_auth_',
                        cascadeDelete: false
                    }
                },
                {
                    name: 'stock_code',
                    type: 'text',
                    options: {
                        maxSize: 255
                    }
                },
                {
                    name: 'quantity',
                    type: 'number',
                    options: {
                        min: 1
                    }
                },
                {
                    name: 'avg_price',
                    type: 'number',
                    options: {
                        min: 0
                    }
                }
            ]
        });
        console.log('portfolio集合创建成功');
    } catch (error) {
        console.error('portfolio集合创建失败:', error);
    }
}

// 创建市场数据集合
async function createMarketDataCollection() {
    try {
        await pb.collections.create({
            name: 'market_data',
            type: 'base',
            schema: [
                {
                    name: 'stock_code',
                    type: 'text',
                    options: {
                        maxSize: 255
                    }
                },
                {
                    name: 'name',
                    type: 'text',
                    options: {
                        maxSize: 255
                    }
                },
                {
                    name: 'current_price',
                    type: 'number',
                    options: {
                        min: 0
                    }
                },
                {
                    name: 'change',
                    type: 'number'
                },
                {
                    name: 'change_percent',
                    type: 'number'
                },
                {
                    name: 'open',
                    type: 'number',
                    options: {
                        min: 0
                    }
                },
                {
                    name: 'high',
                    type: 'number',
                    options: {
                        min: 0
                    }
                },
                {
                    name: 'low',
                    type: 'number',
                    options: {
                        min: 0
                    }
                },
                {
                    name: 'volume',
                    type: 'number',
                    options: {
                        min: 0
                    }
                },
                {
                    name: 'market_type',
                    type: 'select',
                    options: {
                        values: ['A股', '港股'],
                        maxSelect: 1
                    }
                },
                {
                    name: 'market_cap',
                    type: 'number',
                    options: {
                        min: 0
                    }
                },
                {
                    name: 'pe_ratio',
                    type: 'number',
                    options: {
                        min: 0
                    }
                },
                {
                    name: 'pb_ratio',
                    type: 'number',
                    options: {
                        min: 0
                    }
                },
                {
                    name: 'dividend_yield',
                    type: 'number',
                    options: {
                        min: 0
                    }
                },
                {
                    name: 'high_52w',
                    type: 'number',
                    options: {
                        min: 0
                    }
                },
                {
                    name: 'low_52w',
                    type: 'number',
                    options: {
                        min: 0
                    }
                }
            ]
        });
        console.log('market_data集合创建成功');
    } catch (error) {
        console.error('market_data集合创建失败:', error);
    }
}

// 创建分时数据集合
async function createIntradayDataCollection() {
    try {
        await pb.collections.create({
            name: 'intraday_data',
            type: 'base',
            schema: [
                {
                    name: 'stock_code',
                    type: 'text',
                    options: {
                        maxSize: 255
                    }
                },
                {
                    name: 'timestamp',
                    type: 'date'
                },
                {
                    name: 'price',
                    type: 'number',
                    options: {
                        min: 0
                    }
                },
                {
                    name: 'volume',
                    type: 'number',
                    options: {
                        min: 0
                    }
                },
                {
                    name: 'amount',
                    type: 'number',
                    options: {
                        min: 0
                    }
                }
            ]
        });
        console.log('intraday_data集合创建成功');
    } catch (error) {
        console.error('intraday_data集合创建失败:', error);
    }
}

// 创建技术指标集合
async function createTechnicalIndicatorsCollection() {
    try {
        await pb.collections.create({
            name: 'technical_indicators',
            type: 'base',
            schema: [
                {
                    name: 'stock_code',
                    type: 'text',
                    options: {
                        maxSize: 255
                    }
                },
                {
                    name: 'timestamp',
                    type: 'date'
                },
                {
                    name: 'macd',
                    type: 'number'
                },
                {
                    name: 'signal',
                    type: 'number'
                },
                {
                    name: 'histogram',
                    type: 'number'
                },
                {
                    name: 'rsi',
                    type: 'number',
                    options: {
                        min: 0,
                        max: 100
                    }
                },
                {
                    name: 'ma5',
                    type: 'number',
                    options: {
                        min: 0
                    }
                },
                {
                    name: 'ma10',
                    type: 'number',
                    options: {
                        min: 0
                    }
                },
                {
                    name: 'ma20',
                    type: 'number',
                    options: {
                        min: 0
                    }
                }
            ]
        });
        console.log('technical_indicators集合创建成功');
    } catch (error) {
        console.error('technical_indicators集合创建失败:', error);
    }
}

// 主函数
async function main() {
    console.log('开始创建集合...');
    
    // 创建所有集合（不依赖管理员登录）
    await createPortfolioCollection();
    await createMarketDataCollection();
    await createIntradayDataCollection();
    await createTechnicalIndicatorsCollection();

    console.log('所有集合创建完成');
}

main();