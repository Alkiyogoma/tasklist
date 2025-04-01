<?php

namespace App\Repositories;


use App\Models\UtilityBill;
use App\Repositories\Interfaces\UtilityBillRepositoryInterface;

class UtilityBillRepository implements UtilityBillRepositoryInterface
{
    protected $model;

    public function __construct(UtilityBill $utility)
    {
        $this->model = $utility;
    }

    public function getByPropertyId($propertyId)
    {
        return $this->model->where('property_id', $propertyId)->get();
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $utility = $this->model->findOrFail($id);
        $utility->update($data);
        return $utility;
    }

    public function delete($id)
    {
        $utility = $this->model->findOrFail($id);
        return $utility->delete();
    }
}
