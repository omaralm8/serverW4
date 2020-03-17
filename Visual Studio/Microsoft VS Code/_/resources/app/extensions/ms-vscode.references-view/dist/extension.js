module.exports=function(e){var t={};function i(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,i),r.l=!0,r.exports}return i.m=e,i.c=t,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i(i.s=4)}([function(e,t){e.exports=require("vscode")},function(e,t,i){"use strict";var n=this&&this.__awaiter||function(e,t,i,n){return new(i||(i=Promise))(function(r,o){function s(e){try{c(n.next(e))}catch(e){o(e)}}function a(e){try{c(n.throw(e))}catch(e){o(e)}}function c(e){e.done?r(e.value):new i(function(t){t(e.value)}).then(s,a)}c((n=n.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:!0});const r=i(0),o=i(2);class s{constructor(e,t,i,n,r,o){this.id=e,this.uri=t,this.position=i,this.preview=n,this.word=r,this.line=o}}t.HistoryItem=s;class a{constructor(){this._items=new Map}get isEmpty(){return 0==this._items.size}*[Symbol.iterator](){let e=[...this._items.values()];for(let t=e.length-1;t>=0;t--)yield e[t]}add({uri:e,position:t}){return n(this,void 0,void 0,function*(){let i;try{i=yield r.workspace.openTextDocument(e)}catch(e){return}const n=i.getWordRangeAtPosition(t);if(!n)return;const c=a._makeId(e,n.start);let{before:l,inside:u,after:d}=o.getPreviewChunks(i,n);l=l.replace(/s$/g,String.fromCharCode(160)),d=d.replace(/^s/g,String.fromCharCode(160));let h=`[${u}](command:references-view.refind?${encodeURIComponent(JSON.stringify([c]))} "${`${r.workspace.asRelativePath(e)}:${t.line+1}:${t.character+1}`}")`;this._items.delete(c),this._items.set(c,new s(c,e,t,l+h+d,u,l+u+d))})}get(e){return this._items.get(e)}clear(){this._items.clear()}static _makeId(e,t){return Buffer.from(e.toString()+t.line+t.character).toString("base64")}}t.History=a},function(e,t,i){"use strict";var n=this&&this.__awaiter||function(e,t,i,n){return new(i||(i=Promise))(function(r,o){function s(e){try{c(n.next(e))}catch(e){o(e)}}function a(e){try{c(n.throw(e))}catch(e){o(e)}}function c(e){e.done?r(e.value):new i(function(t){t(e.value)}).then(s,a)}c((n=n.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:!0});const r=i(0),o=i(3),s=i(1);function a(e,t,i=8,n=!0){let o=t.start.with({character:Math.max(0,t.start.character-i)}),s=e.getWordRangeAtPosition(o),a=e.getText(new r.Range(s?s.start:o,t.start)),c=e.getText(t),l=t.end.translate(0,331),u=e.getText(new r.Range(t.end,l));return n&&(a=a.replace(/^\s*/g,""),u=u.replace(/\s*$/g,"")),{before:a,inside:c,after:u}}t.getPreviewChunks=a;t.DataProvider=class{constructor(e){this._onDidChangeTreeData=new r.EventEmitter,this.onDidChangeTreeData=this._onDidChangeTreeData.event,this._onDidReturnEmpty=new r.EventEmitter,this.onDidReturnEmpty=this._onDidReturnEmpty.event,this._history=e}setModelCreation(e){this._modelListener&&this._modelListener.dispose(),this._modelCreation=e,this._onDidChangeTreeData.fire(),e&&e.then(t=>{t&&e===this._modelCreation&&(this._modelListener=t.onDidChange(e=>this._onDidChangeTreeData.fire(e instanceof o.FileItem?e:void 0)))})}getTreeItem(e){return n(this,void 0,void 0,function*(){if(e instanceof o.FileItem){const t=new r.TreeItem(e.uri);return t.contextValue="file-item",t.description=!0,t.iconPath=r.ThemeIcon.File,t.collapsibleState=r.TreeItemCollapsibleState.Collapsed,t}if(e instanceof o.ReferenceItem){const{range:t}=e.location,i=yield e.parent.getDocument(!0),{before:n,inside:o,after:s}=a(i,t),c={label:n+o+s,highlights:[[n.length,n.length+o.length]]},l=new r.TreeItem2(c);return l.collapsibleState=r.TreeItemCollapsibleState.None,l.contextValue="reference-item",l.command={title:"Open Reference",command:"references-view.show",arguments:[e]},l}if(e instanceof s.HistoryItem){const t=new r.TreeItem(e.word);return t.description=`${r.workspace.asRelativePath(e.uri)} • ${e.line}`,t.collapsibleState=r.TreeItemCollapsibleState.None,t.contextValue="history-item",t.command={title:"Show Location",command:"references-view.show",arguments:[e]},t}throw new Error})}getChildren(e){return n(this,void 0,void 0,function*(){if(e instanceof o.FileItem)return e.results;if(this._modelCreation){const e=yield this._modelCreation;return e&&0!==e.items.length?e.items:[...this._history]}return this._onDidReturnEmpty.fire(this),[...this._history]})}getParent(e){return e instanceof o.ReferenceItem?e.parent:void 0}}},function(e,t,i){"use strict";var n=this&&this.__awaiter||function(e,t,i,n){return new(i||(i=Promise))(function(r,o){function s(e){try{c(n.next(e))}catch(e){o(e)}}function a(e){try{c(n.throw(e))}catch(e){o(e)}}function c(e){e.done?r(e.value):new i(function(t){t(e.value)}).then(s,a)}c((n=n.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:!0});const r=i(0);class o{constructor(e,t,i){this.uri=e,this.results=t,this.parent=i}getDocument(e){if(this._document||(this._document=r.workspace.openTextDocument(this.uri)),e){const e=this.parent.move(this,!0);e&&!e.parent._document&&this._document.then(()=>e.parent.getDocument(!1))}return this._document}}t.FileItem=o;class s{constructor(e,t){this.location=e,this.parent=t}}t.ReferenceItem=s;class a{constructor(e,t,i){let n;this.uri=e,this.position=t,this._onDidChange=new r.EventEmitter,this.onDidChange=this._onDidChange.event,this.items=[],i.sort(a._compareLocations);for(const e of i)n&&n.uri.toString()===e.uri.toString()||(n=new o(e.uri,[],this),this.items.push(n)),n.results.push(new s(e,n))}static create(e,t){return n(this,void 0,void 0,function*(){let i=yield r.commands.executeCommand("vscode.executeReferenceProvider",e,t);if(i)return new a(e,t,i)})}get total(){let e=0;for(const t of this.items)e+=t.results.length;return e}get(e){for(const t of this.items)if(t.uri.toString()===e.toString())return t}first(){for(const e of this.items)if(e.uri.toString()===this.uri.toString()){for(const t of e.results)if(t.location.range.contains(this.position))return t;return}}remove(e){e instanceof o?(a._del(this.items,e),this._onDidChange.fire(this)):e instanceof s&&(a._del(e.parent.results,e),0===e.parent.results.length?(a._del(this.items,e.parent),this._onDidChange.fire(this)):this._onDidChange.fire(e.parent))}move(e,t){const i=t?1:-1,n=e=>{const t=(this.items.indexOf(e)+i+this.items.length)%this.items.length;return this.items[t]};if(e instanceof o)return t?e.results[0]:a._tail(n(e).results);if(e instanceof s){const t=e.parent.results.indexOf(e)+i;return t<0?a._tail(n(e.parent).results):t>=e.parent.results.length?n(e.parent).results[0]:e.parent.results[t]}}static _compareLocations(e,t){return e.uri.toString()<t.uri.toString()?-1:e.uri.toString()>t.uri.toString()?1:e.range.start.isBefore(t.range.start)?-1:e.range.start.isAfter(t.range.start)?1:0}static _del(e,t){const i=e.indexOf(t);i>=0&&e.splice(i,1)}static _tail(e){return e[e.length-1]}}t.Model=a},function(e,t,i){"use strict";var n=this&&this.__awaiter||function(e,t,i,n){return new(i||(i=Promise))(function(r,o){function s(e){try{c(n.next(e))}catch(e){o(e)}}function a(e){try{c(n.throw(e))}catch(e){o(e)}}function c(e){e.done?r(e.value):new i(function(t){t(e.value)}).then(s,a)}c((n=n.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:!0});const r=i(0),o=i(1),s=i(3),a=i(2),c=i(5);t.activate=function(e){const t="references-view.tree",i=new o.History,l=new a.DataProvider(i),u=r.window.createTreeView(t,{treeDataProvider:l,showCollapseAll:!0}),d=new c.EditorHighlights;let h;r.window.onDidChangeActiveTextEditor(()=>u.visible&&d.show(),e.subscriptions),u.onDidChangeVisibility(e=>e.visible?d.show():d.hide(),e.subscriptions);const m=()=>{let e;e=i.isEmpty?"No results found.":"No results found. Run a previous search again:",u.message=e},f=()=>{h&&(1===h.total&&1===h.items.length?u.message=`${h.total} result in ${h.items.length} file`:1===h.total?u.message=`${h.total} result in ${h.items.length} files`:1===h.items.length?u.message=`${h.total} results in ${h.items.length} file`:u.message=`${h.total} results in ${h.items.length} files`)},g=e=>n(this,void 0,void 0,function*(){yield r.commands.executeCommand("setContext","reference-list.isActive",!0),r.commands.executeCommand(`${t}.focus`),d.setModel(void 0),u.message=void 0;const i=e();if(l.setModelCreation(i),!i)return m();if(h=yield i,r.commands.executeCommand("setContext","reference-list.hasResult",Boolean(h)),!h||0===h.items.length)return m();d.setModel(h);const n=h.first();return n&&u.visible&&u.reveal(n,{select:!0,focus:!0}),f(),h}),v=(e,t)=>n(this,void 0,void 0,function*(){const n=yield g(()=>{if(e instanceof r.Uri&&t instanceof r.Position)return s.Model.create(e,t);if(r.window.activeTextEditor){let e=r.window.activeTextEditor;if(e.document.getWordRangeAtPosition(e.selection.active))return s.Model.create(e.document.uri,e.selection.active)}});n&&(i.add(n),r.commands.executeCommand("setContext","reference-list.hasHistory",!0))}),p=e=>{if(e instanceof o.HistoryItem)return v(e.uri,e.position)},w=()=>{r.commands.executeCommand("setContext","reference-list.hasResult",!1),d.setModel(void 0),l.setModelCreation(void 0)},_=(e,t)=>{if(e instanceof s.ReferenceItem){const{location:i}=e;r.window.showTextDocument(i.uri,{selection:i.range.with({end:i.range.start}),preserveFocus:!t})}else e instanceof o.HistoryItem&&r.window.showTextDocument(e.uri,{selection:new r.Range(e.position,e.position),preserveFocus:!1})},y=e=>{if(!h)return;const t=u.selection[0]||h.first();if(t instanceof o.HistoryItem)return;const i=h.move(t,e);i&&(u.reveal(i,{select:!0}),_(i,!0))},C=e=>n(this,void 0,void 0,function*(){let t="",i=[e];for(;i.length>0;){let e=i.pop();if(e instanceof s.Model)i.push(...e.items.slice(0,99));else if(e instanceof s.ReferenceItem){let i=yield e.parent.getDocument(),n=a.getPreviewChunks(i,e.location.range,21,!1);t+=`  ${e.location.range.start.line+1},${e.location.range.start.character+1}:${n.before+n.inside+n.after}\n`}else e instanceof s.FileItem&&(t+=`${r.workspace.asRelativePath(e.uri)}\n`,i.push(...e.results))}t&&(yield r.env.clipboard.writeText(t))}),x=(e,t,i)=>n(this,void 0,void 0,function*(){yield g(()=>Promise.resolve(new s.Model(e,t,i)))});let b;const D="references.preferredLocation";function T(e){if(e&&!e.affectsConfiguration(D))return;const t=r.workspace.getConfiguration().get(D);b&&(b.dispose(),b=void 0),"view"===t&&(b=r.commands.registerCommand("editor.action.showReferences",x))}T(),e.subscriptions.push(u,r.workspace.onDidChangeConfiguration(T),r.commands.registerCommand("references-view.find",v),r.commands.registerCommand("references-view.refind",p),r.commands.registerCommand("references-view.refresh",()=>n(this,void 0,void 0,function*(){if(h)return v(h.uri,h.position)})),r.commands.registerCommand("references-view.clear",()=>n(this,void 0,void 0,function*(){w();let e=l.onDidReturnEmpty(()=>{e.dispose(),u.message="To populate this view, open an editor and run the 'Find All References'-command or run a previous search again:"})})),r.commands.registerCommand("references-view.clearHistory",()=>n(this,void 0,void 0,function*(){w(),i.clear(),m(),r.commands.executeCommand("setContext","reference-list.hasHistory",!1)})),r.commands.registerCommand("references-view.show",_),r.commands.registerCommand("references-view.remove",e=>{if(h){const t=h.move(e,!0);h.remove(e),d.refresh(),f(),t&&u.reveal(t,{select:!0})}}),r.commands.registerCommand("references-view.next",()=>y(!0)),r.commands.registerCommand("references-view.prev",()=>y(!1)),r.commands.registerCommand("references-view.copy",C),r.commands.registerCommand("references-view.copyAll",()=>C(h)),r.commands.registerCommand("references-view.copyPath",e=>{e instanceof s.FileItem&&("file"===e.uri.scheme?r.env.clipboard.writeText(e.uri.fsPath):r.env.clipboard.writeText(e.uri.toString(!0)))}),r.commands.registerCommand("references-view.pickFromHistory",()=>n(this,void 0,void 0,function*(){const e=[...i].map(e=>({label:e.word,description:`${r.workspace.asRelativePath(e.uri)} • ${e.line}`,item:e})),t=yield r.window.showQuickPick(e,{placeHolder:"Select previous reference search"});t&&(yield p(t.item))})))}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=i(0);t.EditorHighlights=class{constructor(){this._decorationType=n.window.createTextEditorDecorationType({backgroundColor:new n.ThemeColor("editor.findMatchHighlightBackground"),rangeBehavior:n.DecorationRangeBehavior.ClosedClosed,overviewRulerLane:n.OverviewRulerLane.Center,overviewRulerColor:new n.ThemeColor("editor.findMatchHighlightBackground")}),this._ignore=new Set}setModel(e){this._model=e,this._ignore.clear(),this._modelListener&&this._modelListener.dispose(),e?(this.show(),this._modelListener=n.workspace.onDidChangeTextDocument(t=>{this._ignore.add(e.get(t.document.uri))})):this.hide()}show(){const{activeTextEditor:e}=n.window;if(!e||!this._model)return;const t=this._model.get(e.document.uri);t&&!this._ignore.has(t)&&e.setDecorations(this._decorationType,t.results.map(e=>e.location.range))}hide(){const{activeTextEditor:e}=n.window;e&&e.setDecorations(this._decorationType,[])}refresh(){this.hide(),this.show()}}}]);
//# sourceMappingURL=extension.js.map