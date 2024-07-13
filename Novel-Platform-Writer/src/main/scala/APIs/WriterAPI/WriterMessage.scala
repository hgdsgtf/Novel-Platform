package APIs.WriterAPI

import Common.API.API
import Global.ServiceCenter.writerServiceCode
import io.circe.Decoder

abstract class WriterMessage[ReturnType: Decoder]
    extends API[ReturnType](writerServiceCode)
