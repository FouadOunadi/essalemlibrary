import { NextResponse } from "next/server";
import { supabase } from '@/lib/supabase';

// GET - Fetch all categories
export async function GET() {
    try {
        const { data: categories, error } = await supabase
            .from('categories')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching categories:', error);
            return NextResponse.json(
                { message: "Failed to fetch categories", error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { categories: categories || [] },
            { status: 200 }
        );
    } catch (error) {
        console.error('Categories GET error:', error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST - Create new category
export async function POST(request) {
    try {
        const body = await request.json();
        const { name, icon } = body;

        // Validate required fields
        if (!name) {
            return NextResponse.json(
                { message: "Category name is required" },
                { status: 400 }
            );
        }

        // Insert new category with service role client to bypass RLS
        const { createClient } = require('@supabase/supabase-js');
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const { data: newCategory, error } = await supabaseAdmin
            .from('categories')
            .insert([
                {
                    name: name.trim(),
                    icon: icon || null
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error creating category:', error);
            return NextResponse.json(
                { message: "Failed to create category", error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Category created successfully", category: newCategory },
            { status: 201 }
        );
    } catch (error) {
        console.error('Categories POST error:', error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

// PUT - Update category
export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, name, icon } = body;

        // Validate required fields
        if (!id || !name) {
            return NextResponse.json(
                { message: "Category ID and name are required" },
                { status: 400 }
            );
        }

        // Update category with service role client to bypass RLS
        const { createClient } = require('@supabase/supabase-js');
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const { data: updatedCategory, error } = await supabaseAdmin
            .from('categories')
            .update({
                name: name.trim(),
                icon: icon || null,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating category:', error);
            return NextResponse.json(
                { message: "Failed to update category", error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Category updated successfully", category: updatedCategory },
            { status: 200 }
        );
    } catch (error) {
        console.error('Categories PUT error:', error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE - Delete category
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { message: "Category ID is required" },
                { status: 400 }
            );
        }

        // Delete category with service role client to bypass RLS
        const { createClient } = require('@supabase/supabase-js');
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        // Check if category exists and get its data
        const { data: existingCategory, error: fetchError } = await supabaseAdmin
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !existingCategory) {
            return NextResponse.json(
                { message: "Category not found" },
                { status: 404 }
            );
        }

        // Delete category
        const { error: deleteError } = await supabaseAdmin
            .from('categories')
            .delete()
            .eq('id', id);

        if (deleteError) {
            console.error('Error deleting category:', deleteError);
            return NextResponse.json(
                { message: "Failed to delete category", error: deleteError.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Category deleted successfully", category: existingCategory },
            { status: 200 }
        );
    } catch (error) {
        console.error('Categories DELETE error:', error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}