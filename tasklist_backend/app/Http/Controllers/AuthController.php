<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use App\Models\Brand;
use App\Models\Product;
use App\Http\Resources\BrandResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => $request->phone,
            'uuid' => (string) Str::uuid(),
            'role' => 'admin',
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();

        // Optionally create a personal access token (if you plan to use token-based auth)
        $token = $user->createToken('LaravelAuthApp')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token, // Include token only if needed
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function brands(Request $request)
    {
        try {
            $query = Brand::with('categories')->orderBy(
                'created_at',
                'desc'
            );

            if ($request->has('name')) {
                $query->where('name', 'like', '%' . $request->input('name') . '%');
            }

            if ($request->has('status')) {
                $query->where('status', $request->input('status'));
            }
            $brands = $query->paginate(10);

            if ($brands->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No brands found.',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => BrandResource::collection($brands),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function categories($id = 0)
    {
        $product = (int)$id > 0 ? \App\Models\Category::where('id', $id)->orderBy('created_at', 'desc') : \App\Models\Category::orderBy('id', 'asc');
        return $product->get()->map(fn($product) => [
            'id' => $product->uuid,
            'name' => $product->name,
            'total' => $product->products->count(),
            'products' => $product->products()->limit((int)$id > 0 ? 10 : 4)->get()->map(function ($category) {
                return [
                    'id' => $category->id,
                    'uuid' => $category->uuid,
                    'name' => $category->name,
                    'price' => $category->price,
                    'thumbnail' => $category->thumbnail,
                    'image' => $category->image,
                ];
            }),
        ]);
    }


    public function getProducts(Request $request)
    {
        try {
            $query = Product::with(['images', 'reviews.user']);

            foreach ($request->all() as $key => $value) {
                switch ($key) {
                        // Filter by top-level fields in the Product table
                    case 'name':
                    case 'description':
                    case 'price':
                    case 'stock_quantity':
                    case 'status':
                        $query->where($key, 'like', '%' . $value . '%');
                        break;

                        // Filter by features
                    case 'feature_name':
                    case 'feature_value':
                        $query->whereHas('features', function ($q) use ($key, $value) {
                            $field = str_replace('feature_', '', $key);
                            $q->where($field, 'like', '%' . $value . '%');
                        });
                        break;

                        // Filter by images
                    case 'image_url':
                        $query->whereHas('images', function ($q) use ($value) {
                            $q->where('image_url', 'like', '%' . $value . '%');
                        });
                        break;

                        // Filter by reviews
                    case 'review_comment':
                        $query->whereHas('reviews', function ($q) use ($value) {
                            $q->where('comment', 'like', '%' . $value . '%');
                        });
                        break;

                    case 'review_rating':
                        $query->whereHas('reviews', function ($q) use ($value) {
                            $q->where('rating', $value);
                        });
                        break;

                        // Filter by users in reviews
                    case 'review_user_name':
                    case 'review_user_email':
                        $query->whereHas('reviews.user', function ($q) use ($key, $value) {
                            $field = str_replace('review_user_', '', $key); // Remove 'review_user_' prefix
                            $q->where($field, 'like', '%' . $value . '%');
                        });
                        break;

                    default:
                        break;
                }
            }

            $products = $query->orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => ProductResource::collection($products),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getProductCategory($uuid)
    {
        try {
            $brand = Brand::where('uuid', $uuid)->first();
            $query = Product::where('brand_id', $brand->id)->with(['images', 'features', 'reviews.user']);

            $products = $query->orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => ProductResource::collection($products),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getProductById($uuid)
    {
        try {
            $query = Product::where('uuid', $uuid)->with(['images', 'features', 'reviews.user']);
            $product = $query->orderBy('created_at', 'desc')->first();

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found.',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => new ProductResource($product),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getSingleProduct($id)
    {
        try {
            $query = Product::where('uuid', $id)->with(['images', 'features', 'reviews.user']);
            $product = $query->orderBy('created_at', 'desc')->first();

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found.',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => new ProductResource($product),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
