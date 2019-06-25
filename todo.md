
---- Issue: normalizing the ngrx-store --------------
config-wizard: 
    this.processes: Observable<Process[]> = this.store.getProcesses()
    => this way, the wizard-page needs not to listen for process-state - it will be constant, because once process changes, the page will be recreated. 
        => ugh, but this seems bad. Maybe I should only store the process-state in the store, not all processes. 
            wps-state
                suggestion:
                    should not be full process[], but rather {procId: procState, prodId: prodVal}
                    then retrieved as process[] via ngrx-selector


    subissue: 
        configwizard needs
            processStates from store -> easy
            processDescriptions -> from where do I get these?
                                        well, from wps.selectors, right?
                                            but selectors have no access to workflowcontrol, because wfc only initated by DI
                                        Then get processes as const from separate file!
                                            but processes need a httpClient, only provided by DI!
                                    It seems that here we have a fatal case where the model depends on the framework it runs in. 
                                    This is actually what DI tries to avoid, right?







---- Issue: allow processes to add new products whenever a new product arrives ---------
should this be done in workflowcontrol or in ngrx?


---- Issue: what to do with focus-state -------------
config-wizard: 
    focusedProcess in store
        => or should it rather be in a separate global state container, lets call it EphemeralGlobalStateService?

---- Issue: data-return-type for dynforms -----------
wizard-page: 
    onSubmit(data) {
        store.dispatch(new ParametersProvided) ?
    => make sure data is really WpsData, not just its value


things learned about ngrx
    store is just a GlobalStateService with readonly state. 
    changes in state happen through message-system. 


things learned about design
    classes should be used for injected dependencies. 
    model should be separate from these classes. 
    ie: 

        export const processes: Process[];

        export class ProcessWrapper{
            constructor(httpClient: HttpClient) {
                this.model = processes[3]
            }