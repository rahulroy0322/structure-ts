import type { ErrorControllerType, ServerRespnsceType } from "../../@types";
import { internalServerError } from "../status";

const errorController: ErrorControllerType<ServerRespnsceType> = (
    e,
    question,
    reply
) => {
    const route = question.path()

    const error =
        e instanceof Error
            ? e
            : {
                name: 'Unknown Error',
                message: 'Internal Server Error',
            };

    reply.status(internalServerError()).json({
        success: false,
        route,
        error,
    });
}

export {
    errorController
}