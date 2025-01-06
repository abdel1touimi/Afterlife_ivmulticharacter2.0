CharactersMenu = function()
    local option = GetPlayerCharactersArray()

    local resp = CreateCamScene(option[1])

    Wait(2000)
    Nuimessage('visible', true)
    Nuimessage('loadingscreen', false)
    Nuicontrol(true)
end


---@param character table
---@param data table
CreateLocalPed = function(character, data)

    local model, skin = GetPlayerSkin(character)

    SetEntityVisible(PlayerPedId(), false)

    SetEntityCoords(PlayerPedId(), data.location.x, data.location.y, data.location.z, 0, 0, 0, false)
    SetEntityHeading(PlayerPedId(), data.location.w)
    lib.requestModel(model)
    print(model)
    SetPlayerModel(cache.playerId, model)

    if skin then
        LoadSkin(skin)
    end

    SetModelAsNoLongerNeeded(model)
    FreezeEntityPosition(PlayerPedId(), true)
    lib.requestAnimDict(data.dict)
    TaskPlayAnim(PlayerPedId(), data.dict, data.anim, -1, -1, -1, 1, 1, true, true, true)

    Wait(100)
    SetEntityVisible(PlayerPedId(), true)
    
    return true
end


cazm = nil
local previewvehicle = nil

---@param character table
CreateCamScene = function(character)
    DisableWeatherSync()
    Wait(500)

    if DoesEntityExist(previewvehicle) then
        DeleteEntity(previewvehicle)
    end

    local data = GetCurrentScene()



    SetOverrideWeather(data.weather)
    NetworkOverrideClockTime(data.time.hours, data.time.minutes, data.time.seconds)


    cam = CreateCameraWithParams('DEFAULT_SCRIPTED_CAMERA', data.camlocation.x, data.camlocation.y, data.camlocation.z,
        data.camrotation.x, data.camrotation.y, data.camrotation.z, data.fov, false, 0)
 
        SetFocusPosAndVel(data.camlocation.x, data.camlocation.y, data.camlocation.z,0,0,0)

    SetTimecycleModifier('MIDDAY')
    SetCamUseShallowDofMode(cam, true)
    SetCamNearDof(cam, 0.4)
    SetCamFarDof(cam, 1.8)
    SetCamDofStrength(cam, 0.7)
    SetCamActive(cam, true)
    RenderScriptCams(true, false, 0, true, true)



    Wait(1000)
    if data.vehicle then
        lib.requestModel(data.vehicle, 30000)
        previewvehicle = CreateVehicle(data.vehicle, data.vehiclelocation.x, data.vehiclelocation.y,
            data.vehiclelocation.z,
            data.vehiclelocation.w, false, false)
    end

    local resp = CreateLocalPed(character, data)
    -- CreateThread(function()
    --     while DoesCamExist(cam) do
    --         SetUseHiDof()
    --         Wait(0)
    --     end
    -- end)
    return true
end


DeleteCamScene = function()
    ClearFocus()
    SetCamActive(cam, false)
    DestroyCam(cam, true)
    RenderScriptCams(false, false, 1, true, true)
    DeleteEntity(PlayerPedId())
end
