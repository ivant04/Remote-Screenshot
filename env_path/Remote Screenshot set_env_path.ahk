; This script adds an input to the system Path enviroment variable after the program installs

if(A_IsAdmin != 1) {
    Run *RunAs %A_ScriptFullPath%
    ExitApp
    return
}

pp := A_ScriptDir . "\..\cmd"
thispath := GetFullPathName(pp)
RegRead, oldenv, HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment, Path
if(ErrorLevel) {
    MsgBox, , "Remote Screenshot Installer", Failed to set the system Path Environment variable.`nUninstall the program and run the setup again with Administrator privileges.
}

if(InStr(oldenv, thispath)) { ; If the path is already added exit
    ExitApp
    return
}
else {
    thispath .= ";"
    
    if(SubStr(oldenv, 0) != ";") {
        oldenv .= ";"
    }

    newenv := oldenv . thispath
    
    RegWrite, REG_SZ, HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment, Path, %newenv%
    if(ErrorLevel) {
        MsgBox, , "Remote Screenshot Installer", Failed to set the system Path Environment variable.`nUninstall the program and run the setup again with Administrator privileges.
    }
    EnvUpdate
}

return


GetFullPathName(path) {
    cc := DllCall("GetFullPathName", "str", path, "uint", 0, "ptr", 0, "ptr", 0, "uint")
    VarSetCapacity(buf, cc*(A_IsUnicode?2:1))
    DllCall("GetFullPathName", "str", path, "uint", cc, "str", buf, "ptr", 0, "uint")
    return buf
}