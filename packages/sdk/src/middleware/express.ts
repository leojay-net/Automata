import { Request, Response, NextFunction } from 'express';
import { AutomataVerifier } from '../verifier';

export const automataMiddleware = (
    verifier: AutomataVerifier,
    subCost: number
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const paymentHeader = req.headers['x-402-payment'];

        if (!paymentHeader) {
            return res.status(402).json({
                error: "Payment Required",
                detail: `Please pay ${subCost} to access this resource.`,
                paymentInfo: {
                    amount: subCost,
                    receiver: (verifier as any).serviceProviderAddress
                }
            });
        }

        const txHash = Array.isArray(paymentHeader) ? paymentHeader[0] : paymentHeader;

        const result = await verifier.verifyPayment(txHash, subCost);

        if (!result.valid) {
            return res.status(403).json({
                error: "Payment Invalid",
                detail: result.error
            });
        }

        // Attach payment info to request for downstream use
        (req as any).automata = result;

        next();
    };
};
