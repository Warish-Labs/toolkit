"use client";

import { useState, useEffect } from "react";
import { getCookiesList, getLocalStorageItems, getSessionStorageItems, type StorageItem } from "@/src/logic/storage-viewer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/ui/shared/tabs";

export function StorageViewerTool() {
  const [activeTab, setActiveTab] = useState("cookies");

  const [cookies, setCookies] = useState<StorageItem[]>([]);
  const [localItems, setLocalItems] = useState<StorageItem[]>([]);
  const [sessionItems, setSessionItems] = useState<StorageItem[]>([]);

  const handleRefresh = () => {
    setCookies(getCookiesList());
    setLocalItems(getLocalStorageItems());
    setSessionItems(getSessionStorageItems());
  };

  useEffect(() => {
    handleRefresh();
  }, [activeTab]);

  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val);
  };

  const handleClearAll = (type: 'local' | 'session') => {
    if (typeof window === 'undefined') return;
    if (type === 'local') {
      window.localStorage.clear();
    } else {
      window.sessionStorage.clear();
    }
    handleRefresh();
  };

  const renderTable = (items: StorageItem[], clearType?: 'local' | 'session') => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Found <span className="font-bold text-foreground">{items.length}</span> record{items.length !== 1 && 's'}</span>
          <div className="flex gap-3">
            {clearType && (
              <button
                onClick={() => handleClearAll(clearType)}
                className="text-[10px] text-destructive font-semibold hover:underline"
              >
                Clear All
              </button>
            )}
            <button
              onClick={handleRefresh}
              className="text-[10px] text-primary font-semibold hover:underline"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 overflow-hidden shadow-sm">
          <div className="overflow-x-auto max-h-[350px]">
            <table className="w-full text-xs text-left border-collapse font-mono">
              <thead className="bg-muted/40 font-sans text-muted-foreground uppercase tracking-wider text-[10px] sticky top-0 border-b border-border/60">
                <tr>
                  <th className="p-3 pl-4">Key</th>
                  <th className="p-3 pr-4">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y font-mono">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/30">
                    <td className="p-3 pl-4 font-bold text-foreground select-all truncate max-w-[150px]" title={item.key}>{item.key}</td>
                    <td className="p-3 pr-4 select-all flex justify-between gap-4 items-center">
                      <span className="truncate max-w-[250px]" title={item.value}>{item.value || '(empty)'}</span>
                      <button
                        onClick={() => handleCopy(item.value)}
                        className="text-[10px] text-primary font-semibold hover:underline shrink-0"
                      >
                        Copy
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={2} className="p-8 text-center text-muted-foreground font-sans">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cookies">Cookies</TabsTrigger>
          <TabsTrigger value="local">LocalStorage</TabsTrigger>
          <TabsTrigger value="session">SessionStorage</TabsTrigger>
        </TabsList>

        <TabsContent value="cookies" className="pt-4">
          {renderTable(cookies)}
        </TabsContent>

        <TabsContent value="local" className="pt-4">
          {renderTable(localItems, 'local')}
        </TabsContent>

        <TabsContent value="session" className="pt-4">
          {renderTable(sessionItems, 'session')}
        </TabsContent>
      </Tabs>
    </div>
  );
}
