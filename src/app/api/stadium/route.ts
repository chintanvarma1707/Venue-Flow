import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'public', 'stadium_state.json');

export async function GET() {
  try {
    const fileContents = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    if (!fileContents) return NextResponse.json([]);
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Read Error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const newData = await request.json();
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(newData, null, 2), 'utf8');
    return NextResponse.json({ success: true, data: newData });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
  }
}
