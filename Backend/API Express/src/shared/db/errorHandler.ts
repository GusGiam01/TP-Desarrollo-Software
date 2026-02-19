import { Request, Response, NextFunction } from "express";
import { ValidationError, NotFoundError, UniqueConstraintViolationException } from "@mikro-orm/core";

export function errorHandler(error:any, req: Request, res: Response, next: NextFunction) {
    console.error(error);
    console.log(error instanceof NotFoundError)
    console.log(error instanceof ValidationError)
    console.log(error instanceof UniqueConstraintViolationException)
    console.log(error.name)
    console.log(error.message.includes('ECONNREFUSED'))
    if(error instanceof NotFoundError) {
        return res.status(404).json({error: 'Entity not found.', details: error.message})
    }
    if(error instanceof UniqueConstraintViolationException) {
        return res.status(409).json({error: 'Duplicate key error.', details: error.message})
    }
    if(error.name === 'MongoNetworkError') {
        return res.status(503).json({error: 'Database connection error.', details: error.message})
    }
    if(error instanceof ValidationError) {
        return res.status(400).json({error: 'Validation error.', details: error.message}) 
    }

    return res.status(500).json({error: 'Internal server error.', details: error.message})
}