import { useState, useEffect } from 'react';
import { Server, Plus, RefreshCw, ExternalLink,AlertTriangle,X, Zap, TriangleAlert, CircleCheck,Share2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/TableSkeleton.jsx';
import { fetchServers, createServer,deleteServer } from '../api/server.api.js';
import Banner from "../components/ui/Banner.jsx"

export default function ServersPage() {
  const [servers, setServers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSucess, setFormSucess] = useState('');
 const [isModalOpen, setIsModalOpen] = useState(false);
 
 const [selectedServer, setSelectedServer] = useState(null);
const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    guildId: '',
    channelId: '',
    mirrorWebhookUrl: '',
    guildName:'',
    mirrorType: 'discord',
  });

  useEffect(() => {
    fetchServersData();
  }, []);

//   HANDLE FETCH
  const fetchServersData = async () => {
    try {
      setIsLoading(true);
      setError('');
   
      const data = await fetchServers();
    
      console.log(data)
      setServers(Array.isArray(data) ? data : data.servers || []);
      console.log(servers)

      
    } catch (err) {
      setError('Failed to load servers');
    } finally {
      setIsLoading(false);
    }
  };

// HANDLE SUBMIT
const handleSubmit = async (e) => {
  e.preventDefault();

  setFormError("");
     setFormSucess('');
  setIsSubmitting(true);

  try {
    const payload = {
      discordGuildId: formData.guildId,
      targetChannelId: formData.channelId,
      mirrorWebhookUrl: formData.mirrorWebhookUrl,
      mirrorType: formData.mirrorType,
      guildName: formData.guildName,
    };

    const createdServer = await createServer(payload);

    // setServers((prev) => [...prev, createdServer]);
      await fetchServersData();

    setFormData({
      guildId: "",
      guildName: "",
      channelId: "",
      mirrorWebhookUrl: "",
      mirrorType: "discord",
    });
       setFormSucess('Server added successfully');
  } catch (err) {
    // console.log(err?.response?.data?.error?.message)
    setFormError(
      err?.response?.data?.error?.message || "Failed to connect server"
    );
  } finally {
    setIsSubmitting(false);
  }
};

// HANDLE DELETE
const handleConfirmDisconnect = async () => {
  if (!selectedServer) return;

  try {
    setIsDeleting(true);

    await deleteServer(selectedServer);

    setServers((prev) =>
      prev.filter((server) => server.id !== selectedServer)
    );

    setIsModalOpen(false);
    setSelectedServer(null);
  } catch (err) {
    console.error(err);
  } finally {
    setIsDeleting(false);
  }
};
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Connected Servers</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage connected Discord servers</p>
        </div>
        <Button onClick={fetchServersData} variant="secondary" size="sm">
          <RefreshCw className="w-6 h-5 cursor-pointer" />
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-error-50 border border-error-200 p-4 mb-6">
          <p className="text-error-700">{error}</p>
          <Button onClick={fetchServersData} variant="ghost" size="sm" className="mt-2">
            Try again
          </Button>
        </div>
      )}

      <div className='flex mb-8 justify-between align-center gap-4 flex-col md:flex-row'>
        <Banner className=" ring-1 ring-black/"/>

     

      {/* Connect Server Form */}
      <Card className="bg-gray-200 shadow-md ring-1 ring-black/5 rounded-2xl p-3">
        <h2 className="text-xl  font-bold   flex items-center gap-2">
          Connect a Server
        </h2>
        <p className='text-xs text-gray-500 mb-3'>Establish Connection and mirror communications</p>


          
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">
                Guild ID
              </label>
              <input
                type="text"
                required
                value={formData.guildId}
                onChange={(e) => setFormData({ ...formData, guildId: e.target.value })}
                className="input p-2 bg-white rounded-md outline-0 hover:outline-1 active:outline-1 text-gray-500 text-sm outline-primary"
                placeholder="e.g 123456789012345678"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">
                Channel ID
              </label>
              <input
                type="text"
                required
                value={formData.channelId}
                onChange={(e) => setFormData({ ...formData, channelId: e.target.value })}
                className="input p-2 bg-white rounded-md outline-0 hover:outline-1 active:outline-1 text-gray-500 text-sm outline-primary"

                placeholder="e.g 123456789012345678"
              />
            </div>
          </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">
              Mirror Webhook URL
            </label>
            <input
              type="url"
              required
              value={formData.mirrorWebhookUrl}
              onChange={(e) => setFormData({ ...formData, mirrorWebhookUrl: e.target.value })}
            className="input p-2 bg-white rounded-md outline-0 hover:outline-1 active:outline-1 text-gray-500 text-sm outline-primary"

              placeholder="https://discord.com/api/webhooks/..."
            />
          </div>
         <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">
                Guild Name
              </label>
              <input
                type="text"
                required
                value={formData.guildName}
                onChange={(e) => setFormData({ ...formData, guildName: e.target.value })}
                className="input p-2 bg-white rounded-md outline-0 hover:outline-1 active:outline-1 text-gray-500 text-sm outline-primary"

                placeholder="Test Server"
              />
            </div>
</div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Mirror Type
            </label>
            <div className="flex gap-2 p-1 rounded-lg bg-white">
           
              {   [{ label: "Discord", value: "discord" },
      { label: "Slack", value: "slack" }].map((type) => (
        
                <button
                  key={type.value}
                  type="button" 
                  onClick={() => setFormData({ ...formData, mirrorType: type.value })}
                  className={`flex-1 py-2 px-4 cursor-pointer rounded-lg border text-sm font-medium transition-colors ${
                    formData.mirrorType === type.value
                      ? 'bg-primary text-white border-1 border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

 {formError && (
<div className=" mt-0 mb-0 text-semibold text-xs text-red-600">
              <p className="text-xs text-error-700 "><TriangleAlert className='inline' size={16}/> {formError}</p>
            </div>
 )}
 {formSucess && (
<div className=" mt-0 mb-0 text-semibold text-xs text-green-600">
              <p className="text-xs text-error-700 "><CircleCheck className='inline' size={16}/> {formSucess}</p>
            </div>
 )}

          <div className="flex justify-end pt-2">
            <Button type="submit" isLoading={isSubmitting} className='text-sm cursor-pointer bg-linear-to-br from-[#5865F2] to-[#9B5CF6] hover:scale-102 transition ease-in'>
             <Zap/>
              Establish Connection
            </Button>
          </div>
        </form>
      </Card>

 </div>
    


      {/* Server List */}
      <h2 className="text-2xl font-bold text-gray-900 ">Connected Servers</h2>
      <p className='text-sm text-gray-400 mb-3'>View all connected server</p>

      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : servers.length === 0 ? (
        <EmptyState
          icon={Server}
          title="No servers connected"
          description="Connect your first Discord server using the form above."
        />
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {servers.map((server) => (
            <Card key={server.id} className='ring-1 ring-black/5 rounded-xl shadow-card'>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Server className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {server.guildName || server.guildId}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    ID: {server.discordGuildId}
                  </p>
                </div>
              </div>

              <div className="mt-1 pt-4  space-y-2 text-sm">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500"># Channel</span>
                  <span className="text-gray-900"> {server.targetChannelId}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 text-xs"><Share2 className="inline text-xs" size={14}/> Platform</span>
                  <span className="bg-primary-extra-light text-primary px-2  rounded-2xl">{server.mirrorType}</span>
                </div>
                {/* {server.mirrorWebhookUrl && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Mirror</span>
                    <a
                      href={server.mirrorWebhookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                      View
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )} */}
              </div>

              <div>
                <button  
                onClick={() =>{setSelectedServer(server.id);
                     setIsModalOpen(true)}}
                 className='border border-danger cursor-pointer bg-red-50 border-dashed rounded p-2 text-red-500 text-xs w-full mt-4'>
                    Disconnect Server
                </button>
              </div>

              {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {  setSelectedServer(null);
;setIsModalOpen(false)}}
          />
 
          {/* Modal */}
          <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <button
              onClick={() => {setIsModalOpen(false);  setSelectedServer(null);}}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4 cursor-pointer"  />
            </button>
 
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Disconnect Server
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Are you sure you want to disconnect this server? This
                  action cannot be undone.
                </p>
              </div>
            </div>
 
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() =>{  setSelectedServer(null);
; setIsModalOpen(false)}}
                className="rounded-md border cursor-pointer border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                  onClick={handleConfirmDisconnect}
                     disabled={isDeleting}
                className="rounded-md bg-red-500 cursor-pointer px-4 py-2 text-xs font-medium text-white hover:bg-red-600"
              >
                {/* Yes, Disconnect */}
                 {isDeleting ? "Disconnecting..." : "Yes, Disconnect"}
              </button>
            </div>
          </div>
        </div>
      )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
