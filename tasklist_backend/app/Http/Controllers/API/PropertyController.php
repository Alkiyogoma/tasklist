<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\PropertyStoreRequest;
use App\Http\Requests\PropertyUpdateRequest;
use App\Services\PropertyService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use InvalidArgumentException;

use App\Models\Property;
use App\Models\UtilityBill;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class PropertyController extends Controller
{
    protected $propertyService;

    public function __construct(PropertyService $propertyService)
    {
        $this->propertyService = $propertyService;
    }

    /**
     * Get all properties summaries
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function dashboard()
    {
        try {
            $data = [];
            $data['summary'] = Property::selectRaw('COUNT(*) as total, SUM(CASE WHEN type = "commercial" THEN 1 ELSE 0 END) as commercial, SUM(CASE WHEN type = "residential" THEN 1 ELSE 0 END) as residential ')->first()->toArray();

            $data['costs'] = UtilityBill::select('type as name', DB::raw('sum(amount) as value'))->groupBy('type')->get();
            $data['properties'] = $this->propertyService->getAllProperties();
            return response()->json(['data' => $data], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve dashboard summaries', 'message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get all properties
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $properties = $this->propertyService->getAllProperties();
            return response()->json(['data' => $properties], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve properties', 'message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get a specific property by ID
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $property = $this->propertyService->getPropertyById($id);
            return response()->json(['data' => $property], Response::HTTP_OK);
        } catch (\Exception $e) {
            if ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                return response()->json(['error' => 'Property not found'], Response::HTTP_NOT_FOUND);
            }
            return response()->json(['error' => 'Failed to retrieve property', 'message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Create a new property
     * 
     * @param \App\Http\Requests\PropertyStoreRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(PropertyStoreRequest $request)
    {
        try {
            $validated = $request->validated();
            $property = $this->propertyService->createProperty($validated);
            return response()->json(['message' => 'Property created successfully', 'data' => $property], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create property', 'message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update an existing property
     * 
     * @param \App\Http\Requests\PropertyUpdateRequest $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(PropertyUpdateRequest $request, $id)
    {
        try {
            $validated = $request->validated();
            $property = $this->propertyService->updateProperty($id, $validated);
            return response()->json(['message' => 'Property updated successfully', 'data' => $property], Response::HTTP_OK);
        } catch (\Exception $e) {
            if ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                return response()->json(['error' => 'Property not found'], Response::HTTP_NOT_FOUND);
            }
            return response()->json(['error' => 'Failed to update property', 'message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Delete a property
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $this->propertyService->deleteProperty($id);
            return response()->json(['message' => 'Property deleted successfully'], Response::HTTP_OK);
        } catch (\Exception $e) {
            if ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                return response()->json(['error' => 'Property not found'], Response::HTTP_NOT_FOUND);
            }
            return response()->json(['error' => 'Failed to delete property', 'message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get utility consumption history for a property
     * 
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function getConsumptionHistory(Request $request, $id): JsonResponse
    {
        // Validate request parameters
        $validated = $request->validate([
            'utilityType' => 'required|in:all,electricity,water,gas',
            'period' => 'required|in:monthly,quarterly,yearly',
        ]);

        // Find property or return 404
        $property = Property::findOrFail($id);

        // Base query for utility bills
        $query = UtilityBill::where('property_id', $property->id);

        // Filter by utility type if not 'all'
        if ($validated['utilityType'] !== 'all') {
            $query->where('type', $validated['utilityType']);
        }

        // Get date format and group by based on period
        $dateFormat = $this->getDateFormatByPeriod($validated['period']);

        // Get consumption data grouped by period and utility type
        $consumptionData = $query
            ->select(
                DB::raw("DATE_FORMAT(bill_date, '{$dateFormat}') as period"),
                'type',
                DB::raw('SUM(amount) as total_amount'),
                DB::raw('COUNT(*) as bill_count')
            )
            ->groupBy('period', 'type')
            ->orderBy('bill_date')
            ->get();
        // Format the data for response
        $formattedData = $this->formatConsumptionData($consumptionData, $validated['period'], $validated['utilityType']);

        // Calculate some summary statistics for the frontend
        $stats = [];
        if (!empty($formattedData)) {
            $utilityTypes = ['electricity', 'water', 'gas'];
            foreach ($utilityTypes as $type) {
                if ($validated['utilityType'] === 'all' || $validated['utilityType'] === $type) {
                    $values = array_column($formattedData, $type);
                    $stats[$type] = [
                        'average' => !empty($values) ? round(array_sum($values) / count($values), 2) : 0,
                        'max' => !empty($values) ? max($values) : 0,
                        'min' => !empty($values) ? min($values) : 0,
                        'total' => !empty($values) ? array_sum($values) : 0,
                    ];
                }
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'property' => [
                    'id' => $property->id,
                    'uuid' => $property->uuid,
                    'name' => $property->name,
                    'type' => $property->type,
                ],
                'consumption' => $formattedData,
                'stats' => $stats,
                'meta' => [
                    'utility_type' => $validated['utilityType'],
                    'period' => $validated['period'],
                ]
            ]
        ]);
    }

    /**
     * Get date format string based on period type
     * 
     * @param string $period
     * @return string
     */
    private function getDateFormatByPeriod(string $period): string
    {
        return match ($period) {
            'monthly' => '%Y-%m',
            'quarterly' => '%Y-Q%c', // Laravel's MySQL doesn't have direct quarterly formatting, we'll handle this in post-processing
            'yearly' => '%Y',
            default => '%Y-%m',
        };
    }

    /**
     * Format consumption data based on period and utility type
     * 
     * @param \Illuminate\Support\Collection $consumptionData
     * @param string $period
     * @param string $utilityType
     * @return array
     */
    private function formatConsumptionData($consumptionData, string $period, string $utilityType): array
    {
        // If quarterly period, we need to transform MySQL date to quarters
        if ($period === 'quarterly') {
            return $this->formatQuarterlyData($consumptionData, $utilityType);
        }

        $result = [];

        foreach ($consumptionData as $item) {
            $periodKey = $item->period;

            if (!isset($result[$periodKey])) {
                $result[$periodKey] = [
                    'date' => $this->formatPeriodForChart($periodKey, $period),
                    'electricity' => 0,
                    'water' => 0,
                    'gas' => 0,
                ];
            }

            $result[$periodKey][$item->type] = (float) $item->total_amount;
        }

        // Convert assoc array to indexed array for JSON response
        // Sort by date to ensure chronological order in chart
        $formattedResult = array_values($result);
        usort($formattedResult, function ($a, $b) {
            return strcmp($a['date'], $b['date']);
        });

        return $formattedResult;
    }

    /**
     * Format quarterly consumption data for chart compatibility
     * 
     * @param \Illuminate\Support\Collection $consumptionData
     * @param string $utilityType
     * @return array
     */
    private function formatQuarterlyData($consumptionData, string $utilityType): array
    {
        $quarterlyData = [];

        foreach ($consumptionData as $item) {
            // Parse the date to determine the quarter
            [$year, $month] = explode('-', $item->period);
            $month = (int) $month;
            $quarter = ceil($month / 3);
            $periodKey = "{$year}-Q{$quarter}";

            if (!isset($quarterlyData[$periodKey])) {
                // Format date for the chart component
                $date = $this->formatPeriodForChart($periodKey, 'quarterly');

                $quarterlyData[$periodKey] = [
                    'date' => $date,
                    'electricity' => 0,
                    'water' => 0,
                    'gas' => 0,
                ];
            }

            $quarterlyData[$periodKey][$item->type] += (float) $item->total_amount;
        }

        // Convert assoc array to indexed array for JSON response
        // Sort by date to ensure chronological order in chart
        $formattedResult = array_values($quarterlyData);
        usort($formattedResult, function ($a, $b) {
            return strcmp($a['date'], $b['date']);
        });

        return $formattedResult;
    }

    /**
     * Format period string to chart-compatible date format
     * 
     * @param string $period
     * @param string $periodType
     * @return string
     */
    private function formatPeriodForChart(string $period, string $periodType): string
    {
        switch ($periodType) {
            case 'monthly':
                // Convert YYYY-MM to date format that component can parse
                return $period . '-01'; // Add day to make it a full date

            case 'quarterly':
                // Parse quarters like 2023-Q1 to dates
                if (preg_match('/(\d{4})-Q(\d)/', $period, $matches)) {
                    $year = $matches[1];
                    $quarter = $matches[2];

                    // Map quarter to middle month of quarter
                    $month = (($quarter - 1) * 3) + 2; // Q1 -> 2 (Feb), Q2 -> 5 (May), etc.
                    return sprintf('%s-%02d-15', $year, $month);
                }
                return $period;

            case 'yearly':
                // For yearly, use middle of the year
                return $period . '-06-30';

            default:
                return $period;
        }
    }
}
