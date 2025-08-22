import React, { useState } from 'react';
import Card from '../ui/Card';
import { PackageIcon, FilterIcon, ShoppingCartIcon } from '../icons/Icons';

const MOCK_ASSETS = [
  { id: 'a1', name: 'Cyberpunk Character Pack', type: '3D Model', price: 250, thumbnail: 'https://picsum.photos/seed/asset1/300/200', creator: 'NeoForge' },
  { id: 'a2', name: 'Medieval Castle Kit', type: '3D Model', price: 400, thumbnail: 'https://picsum.photos/seed/asset2/300/200', creator: 'StoneWorks' },
  { id: 'a3', name: 'Sci-Fi Weapon VFX', type: 'VFX', price: 150, thumbnail: 'https://picsum.photos/seed/asset3/300/200', creator: 'PixelSpark' },
  { id: 'a4', name: 'Ambient Fantasy Music', type: 'Audio', price: 100, thumbnail: 'https://picsum.photos/seed/asset4/300/200', creator: 'MelodyWeaver' },
  { id: 'a5', name: 'PBR Rock Textures', type: 'Texture', price: 75, thumbnail: 'https://picsum.photos/seed/asset5/300/200', creator: 'SurfacePRO' },
  { id: 'a6', name: 'Low-Poly Forest Pack', type: '3D Model', price: 200, thumbnail: 'https://picsum.photos/seed/asset6/300/200', creator: 'PolyGreen' },
  { id: 'a7', name: '8-Bit Sound Effects', type: 'Audio', price: 50, thumbnail: 'https://picsum.photos/seed/asset7/300/200', creator: 'RetroSFX' },
  { id: 'a8', name: 'Hand-Painted Skyboxes', type: 'Texture', price: 120, thumbnail: 'https://picsum.photos/seed/asset8/300/200', creator: 'SkyPainters' },
];

const ASSET_TYPES = ['All', '3D Model', 'Texture', 'Audio', 'VFX'];

const AssetStoreView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [assetTypeFilter, setAssetTypeFilter] = useState('All');
  const [cart, setCart] = useState<string[]>([]);

  const filteredAssets = MOCK_ASSETS.filter(asset => {
    const typeMatch = assetTypeFilter === 'All' || asset.type === assetTypeFilter;
    const searchMatch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || asset.creator.toLowerCase().includes(searchTerm.toLowerCase());
    return typeMatch && searchMatch;
  });

  const toggleCartItem = (assetId: string) => {
    setCart(prev => prev.includes(assetId) ? prev.filter(id => id !== assetId) : [...prev, assetId]);
  };

  const cartTotal = cart.reduce((total, assetId) => {
    const asset = MOCK_ASSETS.find(a => a.id === assetId);
    return total + (asset?.price || 0);
  }, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
          Asset Store
        </h1>
        <p className="text-[var(--text-secondary)] mt-2">Discover high-quality assets to accelerate your game development.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FilterIcon className="w-6 h-6" /> Filters
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search assets..."
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all"
              />
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Asset Type</label>
                <select
                  value={assetTypeFilter}
                  onChange={e => setAssetTypeFilter(e.target.value)}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-3 focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none transition-all"
                >
                  {ASSET_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-[var(--border-color)]">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <ShoppingCartIcon className="w-5 h-5"/>
                Cart ({cart.length})
              </h3>
              {cart.length > 0 ? (
                 <div className="space-y-2">
                    <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                        <span>Total:</span>
                        <span className="font-bold text-white">{cartTotal.toLocaleString()} NXG</span>
                    </div>
                    <button className="w-full py-2 font-semibold text-white bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg hover:opacity-90 transition-opacity">
                        Checkout
                    </button>
                 </div>
              ) : (
                <p className="text-sm text-center text-[var(--text-secondary)]">Your cart is empty.</p>
              )}
            </div>
          </Card>
        </div>

        {/* Asset Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAssets.map(asset => (
              <Card key={asset.id} className="!p-0 overflow-hidden group">
                <div className="relative">
                  <img src={asset.thumbnail} alt={asset.name} className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs font-bold">{asset.price.toLocaleString()} NXG</div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold truncate">{asset.name}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">by {asset.creator}</p>
                  <button
                    onClick={() => toggleCartItem(asset.id)}
                    className={`w-full mt-4 py-2 text-sm font-semibold rounded-lg border transition-colors ${
                      cart.includes(asset.id)
                        ? 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/40'
                        : 'border-[var(--border-color)] hover:bg-[var(--bg-glass)] hover:border-[var(--accent-primary)]'
                    }`}
                  >
                    {cart.includes(asset.id) ? 'Remove from Cart' : 'Add to Cart'}
                  </button>
                </div>
              </Card>
            ))}
          </div>
          {filteredAssets.length === 0 && (
             <Card className="text-center py-16">
                <PackageIcon className="w-16 h-16 mx-auto text-[var(--text-secondary)] opacity-50"/>
                <h3 className="mt-4 text-xl font-bold">No Assets Found</h3>
                <p className="text-[var(--text-secondary)]">Try adjusting your search or filters.</p>
             </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetStoreView;
