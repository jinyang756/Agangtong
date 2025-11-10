import pb from '@/lib/pocketbase';

export async function GET(request) {
  try {
    // 验证用户认证
    if (!pb.authStore.isValid) {
      return new Response(
        JSON.stringify({ error: '未授权访问' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 获取当前用户的交易记录
    const records = await pb.collection('orders').getFullList({
      filter: `userId = "${pb.authStore.model.id}"`,
      sort: '-created',
    });

    return new Response(
      JSON.stringify(records),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: '获取交易记录失败', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request) {
  try {
    // 验证用户认证
    if (!pb.authStore.isValid) {
      return new Response(
        JSON.stringify({ error: '未授权访问' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await request.json();
    
    // 创建新的交易记录
    const record = await pb.collection('orders').create({
      userId: pb.authStore.model.id,
      type: data.type,
      stockCode: data.stockCode,
      price: data.price,
      quantity: data.quantity,
      status: 'pending'
    });

    return new Response(
      JSON.stringify(record),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: '创建交易记录失败', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}