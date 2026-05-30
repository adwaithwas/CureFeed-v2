import { Innertube } from "youtubei.js";
export declare const getYoutubeInstance: () => Promise<Innertube>;
export declare const fetchChannelData: (url: string) => Promise<{
    channel: {
        id: any;
        name: string | undefined;
        avatar: string;
        subscriberCount: any;
        url: string | undefined;
    };
    home: any[];
    videos: any[];
    members: any[];
    posts: any[];
}>;
//# sourceMappingURL=youtube.service.d.ts.map