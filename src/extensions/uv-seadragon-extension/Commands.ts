class Commands {
    static namespace: string = 'seadragonExtension.';

    static CLEAR_SEARCH: string                     = Commands.namespace + 'onClearSearch';
    static CURRENT_VIEW_URI: string                 = Commands.namespace + 'onCurrentViewUri';
    static DOWNLOAD_CURRENTVIEW: string             = Commands.namespace + 'onDownloadCurrentView';
    static DOWNLOAD_ENTIREDOCUMENTASPDF: string     = Commands.namespace + 'onDownloadEntireDocumentAsPDF';
    static DOWNLOAD_ENTIREDOCUMENTASTEXT: string    = Commands.namespace + 'onDownloadEntireDocumentAsText';
    static DOWNLOAD_WHOLEIMAGEHIGHRES: string       = Commands.namespace + 'onDownloadWholeImageHighRes';
    static DOWNLOAD_WHOLEIMAGELOWRES: string        = Commands.namespace + 'onDownloadWholeImageLowRes';
    static ENTER_MULTI_SELECTION_MODE: string       = Commands.namespace + 'onEnterMultiSelectionMode';
    static EXIT_MULTI_SELECTION_MODE: string        = Commands.namespace + 'onExitMultiSelectionMode';
    static FIRST: string                            = Commands.namespace + 'onFirst';
    static GALLERY_THUMB_SELECTED: string           = Commands.namespace + 'onGalleryThumbSelected';
    static IMAGE_SEARCH: string                     = Commands.namespace + 'onImageSearch';
    static LAST: string                             = Commands.namespace + 'onLast';
    static MODE_CHANGED: string                     = Commands.namespace + 'onModeChanged';
    static MULTI_SELECTION: string                  = Commands.namespace + 'onMultiSelection';
    static NEXT: string                             = Commands.namespace + 'onNext';
    static NEXT_SEARCH_RESULT: string               = Commands.namespace + 'onNextSearchResult';
    static OPEN_THUMBS_VIEW: string                 = Commands.namespace + 'onOpenThumbsView';
    static OPEN_TREE_VIEW: string                   = Commands.namespace + 'onOpenTreeView';
    static PAGE_SEARCH: string                      = Commands.namespace + 'onPageSearch';
    static PREV: string                             = Commands.namespace + 'onPrev';
    static PREV_SEARCH_RESULT: string               = Commands.namespace + 'onPrevSearchResult';
    static SEADRAGON_ANIMATION: string              = Commands.namespace + 'onAnimation';
    static SEADRAGON_ANIMATION_FINISH: string       = Commands.namespace + 'onAnimationfinish';
    static SEADRAGON_ANIMATION_START: string        = Commands.namespace + 'onAnimationStart';
    static SEADRAGON_OPEN: string                   = Commands.namespace + 'onOpen';
    static SEADRAGON_RESIZE: string                 = Commands.namespace + 'onResize';
    static SEADRAGON_ROTATION: string               = Commands.namespace + 'onRotation';
    static SEARCH: string                           = Commands.namespace + 'onSearch';
    static SEARCH_PREVIEW_FINISH: string            = Commands.namespace + 'onSearchPreviewFinish';
    static SEARCH_PREVIEW_START: string             = Commands.namespace + 'onSearchPreviewStart';
    static SEARCH_RESULTS: string                   = Commands.namespace + 'onSearchResults';
    static SEARCH_RESULTS_EMPTY: string             = Commands.namespace + 'onSearchResultsEmpty';
    static THUMB_MULTISELECTED: string              = Commands.namespace + 'onThumbMultiSelected';
    static TREE_NODE_SELECTED: string               = Commands.namespace + 'onTreeNodeSelected';
    static TREE_NODE_MULTISELECTED: string          = Commands.namespace + 'onTreeNodeMultiSelected';
    static VIEW_PAGE: string                        = Commands.namespace + 'onViewPage';
}

export = Commands;