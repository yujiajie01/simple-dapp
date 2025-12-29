import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const uptime = process.uptime()
    const memoryUsage = process.memoryUsage()

    return NextResponse.json({
      success: true,
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: `${Math.floor(uptime)}s`,
      memory: {
        used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Health check failed',
      message: error.message
    }, { status: 500 })
  }
}
