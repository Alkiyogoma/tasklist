<?php

namespace App\Repositories;

use App\Models\Property;
use App\Repositories\Interfaces\PropertyRepositoryInterface;

class PropertyRepository implements PropertyRepositoryInterface
{
    protected $model;

    public function __construct(Property $property)
    {
        $this->model = $property;
    }

    public function getAll()
    {
        return $this->model->all();
    }

    public function getById($id)
    {
        return $this->model->with('utilities')->findOrFail($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $property = $this->model->findOrFail($id);
        $property->update($data);
        return $property;
    }

    public function delete($id)
    {
        $property = $this->model->findOrFail($id);
        return $property->delete();
    }
}
