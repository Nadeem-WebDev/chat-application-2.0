export function formatMessageTime(datetime){
        return new Date(datetime).toLocaleDateString("en-US",{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
}