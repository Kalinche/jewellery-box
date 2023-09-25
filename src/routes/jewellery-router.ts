import { Router } from "express";
import { Request } from "../model/common-types"
import { AppError } from "../model/errors";
import { JewelleryRepository } from "../dao/jewellery-repository";
import * as indicative from "indicative";
import { ObjectId } from "mongodb";
import { verifyToken } from "../middleware/verifyToken";

const jewelleryRouter = Router();

jewelleryRouter.get("/", verifyToken, (req, res, next) =>
    (<JewelleryRepository>req.app.locals.jewelleryRepo)
        .getAllJewelleries()
        .then((jewelleries) => res.json(jewelleries))
        .catch(next)
);

jewelleryRouter.get("/:id", verifyToken, async (req, res, next) => {
    try {
        const id = req.params.id;
        await indicative.validator.validate(
            { id },
            {
                id: "required|regex:^[0-9a-fA-F]{24}$",
            }
        );
    } catch (err) {
        next(new AppError(400, (err as Error).message, err as Error));
        return;
    }
    try {
        const found = await (<JewelleryRepository>req.app.locals.jewelleryRepo).getJewellery(
            new ObjectId(req.params.id)
        );
        res.json(found);
    } catch (err) {
        next(err);
    }
});

jewelleryRouter.post("/", verifyToken, async (req: Request, res, next) => {
    console.log("Adding jewellery...")
    if (req.userId) {
        const userIdObjectId = new ObjectId(req.userId);
        const newJewellery = req.body;

        try {
            const created = await (<JewelleryRepository>req.app.locals.jewelleryRepo).addJewellery(newJewellery, userIdObjectId);
            res.status(201).location(`/${created.id}`).json(created);
        } catch (err) {
            console.log("err: " + err)
            next(err);
        }
    }
});

jewelleryRouter.delete("/:id", verifyToken, async function (req, res, next) {
    try {
        const id = req.params.id;
        await indicative.validator.validate(
            { id },
            {
                id: "required|regex:^[0-9a-fA-F]{24}$",
            }
        );
    } catch (err) {
        next(new AppError(400, (err as Error).message, err as Error));
        return;
    }
    try {
        const jewelleryId = req.params.id;
        const deleted = await (<JewelleryRepository>req.app.locals.jewelleryRepo).deleteJewellery(
            new ObjectId(jewelleryId)
        );
        res.json(deleted);
    } catch (err) {
        next(err);
    }
});

export default jewelleryRouter;