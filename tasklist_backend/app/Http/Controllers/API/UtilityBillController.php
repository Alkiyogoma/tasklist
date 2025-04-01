<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\UtilityStoreRequest;
use App\Http\Requests\UtilityUpdateRequest;
use App\Services\UtilityBillService;
// use Illuminate\Http\Request;
use Illuminate\Support\Facades\Request;

use Illuminate\Http\Response;
use InvalidArgumentException;
use App\Models\UtilityBill;

class UtilityBillController extends Controller
{
    protected $utilityService;

    public function __construct(UtilityBillService $utilityService)
    {
        $this->utilityService = $utilityService;
    }

    public function index()
    {
        try {
            $properties = request('type') ? UtilityBill::where('type', (string) request('type'))->with(['user', 'property'])->latest()->filter(Request::only('search'))->paginate(10) :  UtilityBill::with(['user', 'property'])->latest()->filter(Request::only('search'))->paginate(10);
            return response()->json(['data' => $properties], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve bills', 'message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    public function show($id)
    {
        try {
            $property = UtilityBill::with(['user', 'property'])->where('uuid', $id)->first();
            return response()->json(['data' => $property], Response::HTTP_OK);
        } catch (\Exception $e) {
            if ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                return response()->json(['error' => 'Property not found'], Response::HTTP_NOT_FOUND);
            }
            return response()->json(['error' => 'Failed to retrieve bills', 'message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get utilities by property ID
     * 
     * @param int $propertyId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByPropertyId($propertyId)
    {
        try {
            $utilities = $this->utilityService->getUtilitiesByPropertyId($propertyId);
            return response()->json(['data' => $utilities], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve utilities', 'message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Create a new utility bill
     * 
     * @param \App\Http\Requests\UtilityStoreRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(UtilityStoreRequest $request)
    {
        try {
            $validated = $request->validated();
            $utility = $this->utilityService->createUtility($validated);
            return response()->json(['message' => 'Utility bill created successfully', 'data' => $utility], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create utility bill', 'message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update an existing utility bill
     * 
     * @param \App\Http\Requests\UtilityUpdateRequest $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UtilityUpdateRequest $request, $id)
    {
        try {
            $validated = $request->validated();
            $utility = $this->utilityService->updateUtility($id, $validated);
            return response()->json(['message' => 'Utility bill updated successfully', 'data' => $utility], Response::HTTP_OK);
        } catch (\Exception $e) {
            if ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                return response()->json(['error' => 'Utility bill not found'], Response::HTTP_NOT_FOUND);
            }
            return response()->json(['error' => 'Failed to update utility bill', 'message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Delete a utility bill
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $this->utilityService->deleteUtility($id);
            return response()->json(['message' => 'Utility bill deleted successfully'], Response::HTTP_OK);
        } catch (\Exception $e) {
            if ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                return response()->json(['error' => 'Utility bill not found'], Response::HTTP_NOT_FOUND);
            }
            return response()->json(['error' => 'Failed to delete utility bill', 'message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
