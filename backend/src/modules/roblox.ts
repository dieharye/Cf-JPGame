import { AnyMap } from "./special_types"

export enum HeadshotSize {
    LARGEST = 720,     // 720x720
    SMALLEST = 48,     // 48x48
    NORMAL = 352,      // 352x352
};

export enum HeadshotFormat {
    PNG = 'Png',
    JPEG = 'Jpeg',
};

class RobloxAPI {
    async GetHeadshot(UserId: string | number, Size: HeadshotSize, Format: HeadshotFormat, IsCircular = false): Promise<string> {
        return new Promise((resolve, reject) => {
            fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${UserId}&size=${Size}x${Size}&format=${Format}&isCircular=${IsCircular}`)
                // fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=1877006416&size=48x48&format=Png&isCircular=false`)
                .then(Response => {
                    console.log(Response);
                    return Response.json();
                })
                .then(data => {
                    if (data.data && data.data.length > 0) {
                        resolve(data.data[0].imageUrl)
                    } else {
                        reject(data)
                    }
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
};

const Roblox = new RobloxAPI();
export default Roblox