/**
 * The Machine - Settings API
 *
 * GET /api/settings - List all settings
 * PUT /api/settings - Update a setting
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSetting, listSettings, updateSetting } from '@/lib/db';

// GET /api/settings - List all settings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key) {
      // Get specific setting
      const setting = await getSetting(key);

      if (!setting) {
        return NextResponse.json(
          { success: false, error: 'Setting not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: setting,
      });
    } else {
      // List all settings
      const settings = await listSettings();

      return NextResponse.json({
        success: true,
        data: settings,
        count: settings.length,
      });
    }
  } catch (error) {
    console.error('Error getting settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get settings',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update setting
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    if (!body.key || !body.value || !body.operatorId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (key, value, operatorId)' },
        { status: 400 }
      );
    }

    // Update setting
    await updateSetting(
      body.key,
      body.value,
      body.operatorId,
      body.changeReason
    );

    // Get updated setting
    const setting = await getSetting(body.key);

    return NextResponse.json({
      success: true,
      data: setting,
    });
  } catch (error) {
    console.error('Error updating setting:', error);

    // Check if error is about locked setting
    if (error instanceof Error && error.message.includes('locked')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update setting',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
