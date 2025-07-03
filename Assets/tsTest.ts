import { createClient } from '@supabase/supabase-js/index';
import { setTimeoutPolyFill as setTimeout, clearTimeoutPolyFill as clearTimeout } from '@supabase/global-polyfill-custom/index';  
import { Database } from './supabaseDatabaseTypes'

@component
export class SupabaseComponent extends BaseScriptComponent {
    @input
    projectUrl: string;
    
    @input
    publicAnonToken: string;
    
    @input
    privateServiceToken: string
    
    @input
    channelName: string;
    
    private client;
    private _currentChannel: any | null = null;
    private messageTimer: ReturnType<typeof setTimeout> | null = null;
    private elapsedTime: number = 0;
    
    onAwake() {
        this.client = createClient<Database>(this.projectUrl, this.privateServiceToken);
        print(this.client)
        print(this.client.storage)
        this.createEvent("OnDestroyEvent").bind(() => {
            this.client.removeAllChannels();
        });
        if (this.client) {
            // this.insertData();
            // this.queryData();
            // this.testRealtimeApi(true);
            // this.createStorageBucket()
            // this.queryStorageBucket()
            // this.downloadFileFromBucket()
            // this.callEdgeFunction()
            // this.callPostgrestFunction()
            // this.createAnonymouslyUser();
            // this.createUser();
            this.signInUser();
            // this.retrieveSession();
        }
    }

    onStart() {
        // Create a broadcast channel; we can use the name in the online dashboard to filter logs
        let connected = this.client.channel(this.channelName);

        // Register a callback
        connected.on(
            "broadcast",
            {
                event: "test",
            },
            (payload) => {
                print(`Received broadcast: ${JSON.stringify(payload)}`);
            }
        );

        // Subscribe to the channel
        connected.subscribe((msg) => {
            // Only start sending once we are successfully connected
            print(msg);
            if (msg === `SUBSCRIBED`) {
                this.sendMessage(connected);
            }
        });
    }

    testRealtimeApi(shouldSend: boolean) {
        if (shouldSend) {
            this.onStart();
        } else {
            this.messageTimer && clearTimeout(this.messageTimer);
        }
    }

    async createUser() {
        const { data, error } = await this.client.auth.signUp({
            email: 'yzhao2@snapchat.com',
            password: 'example-password',
        })
        print(data);
        print(error);
    }

    async signInUser() {
        const { data, error } = await this.client.auth.signInWithPassword({
            email: 'yzhao2@snapchat.com',
            password: 'example-password',
            })
        const {user, session} = data
        print(`User: ${JSON.stringify(user)}`);
        print(`Session: ${JSON.stringify(session)}`);
    }

    async retrieveSession() {
        const { data, error } = await this.client.auth.getSession()
        print(JSON.stringify(data));
        print(JSON.stringify(error));
        const { session, user } = data
        if (session) {
            print(`Session: ${JSON.stringify(session)}`);
            print(`User: ${JSON.stringify(user)}`);
        } else {
            print("No session found.");
        }
    }
    
    async createAnonymouslyUser() {
        print("------------start ")
        const { data, error } = await this.client.auth.signInAnonymously({});
        print("------------finished ")
        print(data);
        print(error);
    }

    async sendMessage(channel: any): Promise<void> {
        this.messageTimer = setTimeout(() => {
            this.sendMessage(channel);
            }, 10);

        return channel.send({
            type: "broadcast",
            event: "test",
            payload: { id: 123, created_at: Date.now() },
        });
    }
    
    async insertData() {
        const { error } = await this.client
            .from('testDatabase_movies')
            .insert({ name: 'test movie 1' })
        print("Insert into movies")
        print (JSON.stringify(error));
    }

    async queryData() {
        const { data, error } = await this.client
            .from('testDatabase_movies')
            .select()
        print("query all from movies")
        print(JSON.stringify(data));
        print(JSON.stringify(error));
    }
    
    async createStorageBucket() {
        const { data, error } = await this.client
          .storage
          .createBucket('create.bucket.from.ls.123', {
            public: false,
            allowedMimeTypes: ['image/png'],
            fileSizeLimit: 1024
          })
        print(JSON.stringify(data))
        print(JSON.stringify(error));
    }
    
    async queryStorageBucket() {
//        const { data, error } = await this.client
//          .storage
//          .getBucket('test.bucket.123')
//        print(JSON.stringify(data))
//        print(JSON.stringify(error));
        
        const { data, error } = await this.client
          .storage
          .from('test.bucket.123')
          .list('', {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
          })
        print(JSON.stringify(data))
        print(JSON.stringify(error));
    }
    
    async downloadFileFromBucket() {
        const { data, error } = await this.client
          .storage
          .from('test.bucket.123')
          .download("test.png")
        
        print(JSON.stringify(error));
        print(JSON.stringify(data))
    }

    async callEdgeFunction() {
        const { data, error } = await this.client.functions.invoke('hello', {
            body: { foo: 'bar' }
        });
        print(data);
        print(error);
    }

    async callPostgrestFunction() {
        const { data, error } = await this.client.rpc('hello_world')
        print(data);
        print(error);
    }
}
