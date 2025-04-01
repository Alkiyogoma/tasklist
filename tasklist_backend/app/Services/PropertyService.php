<?php

namespace App\Services;

use App\Repositories\Interfaces\PropertyRepositoryInterface;
use Illuminate\Support\Facades\Validator;
use InvalidArgumentException;

class PropertyService
{
    protected $propertyRepository;

    public function __construct(PropertyRepositoryInterface $propertyRepository)
    {
        $this->propertyRepository = $propertyRepository;
    }

    public function getAllProperties()
    {
        return $this->propertyRepository->getAll();
    }

    public function getPropertyById($id)
    {
        return $this->propertyRepository->getById($id);
    }

    public function createProperty(array $data)
    {
        return $this->propertyRepository->create($data);
    }

    public function updateProperty($id, array $data)
    {
        return $this->propertyRepository->update($id, $data);
    }

    public function deleteProperty($id)
    {
        return $this->propertyRepository->delete($id);
    }
}
