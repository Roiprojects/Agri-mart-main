import { NextResponse } from 'next/server';
import { generateFarmerRecommendations, QuestionnaireInput } from '@/lib/ai-recommendation';

export async function POST(request: Request) {
  try {
    const body: QuestionnaireInput = await request.json();
    const recommendations = generateFarmerRecommendations(body);

    return NextResponse.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process AI agronomy questionnaire' },
      { status: 400 }
    );
  }
}
