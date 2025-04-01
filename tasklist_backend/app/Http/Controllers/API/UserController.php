<?php

namespace App\Http\Controllers\API;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Http\Response;


class UserController extends Controller
{

    public function index()
    {
        try {
            $properties = User::latest()->paginate(10);

            return response()->json(['data' => $properties], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve users', 'message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show($id)
    {
        try {
            $property = User::with('bills')->where('uuid', $id)->first();
            return response()->json(['data' => $property], Response::HTTP_OK);
        } catch (\Exception $e) {
            if ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                return response()->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
            }
            return response()->json(['error' => 'Failed to retrieve user', 'message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
