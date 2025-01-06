
Nuimessage = function (type,data)
    SendNUIMessage({
        action = type,
        data = data
    })
end

Nuicontrol = function (state)
    SetNuiFocus(state, state)
end


loadModel = function(model)
    RequestModel(model)
    while not HasModelLoaded(model) do
        Wait(0)
    end
end

GetPlayerMaxSlots = function(user)
    local extraslots = lib.callback.await('IV:GetExtraSlots', false,user)
    local slots = 0
    pcall(function ()
        slots = Config.Maxslots + extraslots
    end)

    return slots
end


DisableWeatherSync = function ()
    TriggerEvent('qb-weathersync:client:DisableSync')
end

EnableWeatherSync = function ()
    TriggerEvent('qb-weathersync:client:EnableSync')
end