'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { 
  getAllCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory,
  addSubcategory,
  deleteSubcategory,
  getSubcategoriesByCategory
} from '@/lib/firebase/categories.service';
import { FirestoreCategory, FirestoreSubcategory } from '@/lib/firebase/firestore.types';

export default function CategoryManagement() {
  const [categories, setCategories] = useState<FirestoreCategory[]>([]);
  const [subcategories, setSubcategories] = useState<Record<string, FirestoreSubcategory[]>>({});
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubcategory, setShowAddSubcategory] = useState<string | null>(null);

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    imageUrl: '',
    description: '',
    order: 0,
  });

  const [subcategoryForm, setSubcategoryForm] = useState({
    name: '',
    slug: '',
    order: 0,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const cats = await getAllCategories();
      setCategories(cats);

      // Load subcategories for each category
      const subsMap: Record<string, FirestoreSubcategory[]> = {};
      for (const cat of cats) {
        const subs = await getSubcategoriesByCategory(cat.id);
        subsMap[cat.id] = subs;
      }
      setSubcategories(subsMap);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryForm.name || !categoryForm.slug) {
      alert('Name and slug are required');
      return;
    }

    try {
      await addCategory({
        name: categoryForm.name,
        slug: categoryForm.slug,
        imageUrl: categoryForm.imageUrl,
        description: categoryForm.description,
        subcategories: [],
        order: categoryForm.order,
      });

      setCategoryForm({ name: '', slug: '', imageUrl: '', description: '', order: 0 });
      setShowAddCategory(false);
      loadCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category');
    }
  };

  const handleUpdateCategory = async (id: string) => {
    try {
      await updateCategory(id, categoryForm);
      setEditingCategory(null);
      setCategoryForm({ name: '', slug: '', imageUrl: '', description: '', order: 0 });
      loadCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all its subcategories.`)) {
      return;
    }

    try {
      // Delete all subcategories first
      const subs = subcategories[id] || [];
      for (const sub of subs) {
        await deleteSubcategory(sub.id);
      }

      await deleteCategory(id);
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const handleAddSubcategory = async (categoryId: string) => {
    if (!subcategoryForm.name || !subcategoryForm.slug) {
      alert('Name and slug are required');
      return;
    }

    try {
      await addSubcategory({
        name: subcategoryForm.name,
        slug: subcategoryForm.slug,
        categoryId,
        order: subcategoryForm.order,
      });

      setSubcategoryForm({ name: '', slug: '', order: 0 });
      setShowAddSubcategory(null);
      loadCategories();
    } catch (error) {
      console.error('Error adding subcategory:', error);
      alert('Failed to add subcategory');
    }
  };

  const handleDeleteSubcategory = async (subId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete subcategory "${name}"?`)) {
      return;
    }

    try {
      await deleteSubcategory(subId);
      loadCategories();
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      alert('Failed to delete subcategory');
    }
  };

  const startEditCategory = (category: FirestoreCategory) => {
    setEditingCategory(category.id);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      imageUrl: category.imageUrl,
      description: category.description,
      order: category.order,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
          <p className="text-gray-600 mt-1">Manage categories and subcategories for your store</p>
        </div>
        <button
          onClick={() => setShowAddCategory(true)}
          className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Add Category Form */}
      {showAddCategory && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Add New Category</h3>
            <button onClick={() => setShowAddCategory(false)}>
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Category Name"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Slug (e.g., baby-shower)"
              value={categoryForm.slug}
              onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={categoryForm.imageUrl}
              onChange={(e) => setCategoryForm({ ...categoryForm, imageUrl: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg col-span-2"
            />
            <textarea
              placeholder="Description"
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg col-span-2"
              rows={2}
            />
            <input
              type="number"
              placeholder="Order"
              value={categoryForm.order}
              onChange={(e) => setCategoryForm({ ...categoryForm, order: Number(e.target.value) })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            onClick={handleAddCategory}
            className="w-full bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700"
          >
            Add Category
          </button>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-6">
            {editingCategory === category.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={categoryForm.imageUrl}
                    onChange={(e) => setCategoryForm({ ...categoryForm, imageUrl: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg col-span-2"
                  />
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg col-span-2"
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateCategory(category.id)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setCategoryForm({ name: '', slug: '', imageUrl: '', description: '', order: 0 });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">Slug: {category.slug}</p>
                    <p className="text-gray-600 mt-1">{category.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditCategory(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id, category.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Subcategories */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-700">Subcategories</h4>
                    <button
                      onClick={() => setShowAddSubcategory(category.id)}
                      className="text-sm text-rose-600 hover:text-rose-700 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Subcategory
                    </button>
                  </div>

                  {showAddSubcategory === category.id && (
                    <div className="mb-3 p-4 bg-gray-50 rounded-lg space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Subcategory Name"
                          value={subcategoryForm.name}
                          onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Slug"
                          value={subcategoryForm.slug}
                          onChange={(e) => setSubcategoryForm({ ...subcategoryForm, slug: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddSubcategory(category.id)}
                          className="bg-rose-600 text-white px-3 py-1 rounded text-sm hover:bg-rose-700"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setShowAddSubcategory(null);
                            setSubcategoryForm({ name: '', slug: '', order: 0 });
                          }}
                          className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {(subcategories[category.id] || []).map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm text-gray-700">{sub.name}</span>
                        <button
                          onClick={() => handleDeleteSubcategory(sub.id, sub.name)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {(!subcategories[category.id] || subcategories[category.id].length === 0) && (
                      <p className="text-sm text-gray-400 italic">No subcategories yet</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}

        {categories.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No categories yet. Add your first category!</p>
          </div>
        )}
      </div>
    </div>
  );
}
